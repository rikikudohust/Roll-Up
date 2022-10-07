const express = require('express');
const router = express.Router();
const { getInformationFromAddress, getInformationFromIndex } = require('../services/userService.js');
const TxModel = require('../db/tx.js');
const AccModel = require('../db/account.js');
const DepositModel = require('../db/deposit.js');
const TreeModel = require('../db/tree.js')
const Account = require('../models/account.js');
const Transaction = require('../models/transaction.js');
const prv2pub = require('../utils/eddsa.js').prv2pub
const Tree = require('../models/tree.js');


router.get('/user/index/:id', async function (req, res, next) {
    try {
        var id = req.params.id;
        console.log(id)
        var account = await AccModel.find({ index: id }).exec();
        res.status(200).json({
            index: account[0].index,
            fromX: account[0].fromX,
            fromY: account[0].fromY
        });
    } catch (err) {
        console.error("Err user/index/:id", err.message);
        next(err);
    }
});
router.get('/user/address/:address', async function (req, res, next) {
    try {
        res.json(await getInformationFromAddress(req.params.address));
    } catch (err) {
        console.error("Err uer/index/:address", err.message);
        next(err);
    }
})

router.post("/deposit", async (req, res, next) => {
    try {
        var fromX = BigInt(req.body.fromX);
        var fromY = BigInt(req.body.fromY);
        var datax = await AccModel.find({ pubkeyX: fromX, pubkeyY: fromY }).exec();
        if (datax.length != 0) {
            res.status(403).json({ message: "!exist" });
        } else {
            var data = {
                "fromX": fromX,
                "fromY": fromY,
                "tokenType": req.body.tokenType,
                "amount": req.body.amount,
            }
            var depositData = new DepositModel(data);
            depositData.save();
            res.json({ "message": "success" });
        }

    } catch (err) {
        console.error("Error POST /deposit", err);
        next(err)
    }
})

router.post("/transaction", async (req, res) => {
    var prvkey = Buffer.from(req.body.prvkey, "hex");
    var fromX = req.body.fromX;
    var fromY = req.body.fromY;
    var fromIndex = req.body.fromIndex;
    var toX = req.body.toX;
    var toY = req.body.toY;
    var toIndex = req.body.toIndex;
    var nonce = req.body.nonce;
    var balance = req.body.balance;
    var tokenType = req.body.tokenType;
    try {
        var dataX = await AccModel.find({ fromX: fromX, fromY: fromY }).exec();
        if (dataX.length == []) {
            res.status(403).json({ message: "Not Found" });
        } else {
            var newTx = new Transaction(fromX, fromY, fromIndex, toX, toY, toIndex, nonce, balance, tokenType)
            newTx.hashTx();
            newTx.signTxHash(prvkey);
            const txData = new TxModel(newTx);
            txData.save();
            res.json({ message: "success" });
        }
    } catch (err) {
        console.error("Error", err);
    }

})

router.post("/generateState", async (req, res) => {
    try {
        var stateData = await AccModel.find({ index: 0 }).exec();
        if (stateData.length != 0) {
            throw '!Exist';
        }
        var zeroAccount = new Account(0, 0, 0, 0, 0, 0, 0, 0);
        var stateAccount = [zeroAccount];
        const BAL_DEPTH = 4;
        const zeroHash = zeroAccount.hashAccount()
        const numLeaves = 2 ** BAL_DEPTH;
        const zeroLeaves = new Array(numLeaves).fill(zeroHash)
        const zeroTree = new Tree(zeroLeaves);
        await AccModel(zeroAccount).save();
        await TreeModel({root: zeroTree.root, account: 1}).save();
        return res.json({ "message": "init state success" });
    } catch (err) {
        console.error("Error: ", err);
    }
})

// router.post("/wallet", async (req, res) => {
//     try {
//         var prvkey = Buffer.from(req.body.prvkey, "hex");
//         var account = new Account(prvkey);
//         console.log(account)
//         var fromX = account.pubkeyX;
//         var fromY = account.pubkeyY;
//         var datax = await accmodel.find({ pubkeyx: fromx, pubkeyy: fromy }).exec();
//         console.log(datax);
//         if (datax.length != 0) {
//             res.status(403).json({ message: "!exist" });
//         } else {
//             var lastindex = await accmodel.countdocuments({ name: 'accounts' }).exec();
//             const data = {
//                 "index": lastindex,
//                 "pubkeyx": account.pubkeyx.tostring(),
//                 "pubkeyy": account.pubkeyy.tostring(),
//                 "prvkey": req.body.prvkey,
//                 "balance": 0,
//                 "nonce": 0,
//                 "tokentype": 0,
//                 "hash": ""
//             }
//             var accdata = new accmodel(data);
//             accdata.save();
//             res.json(data);
//         }
//     } catch (err) {
//         console.error("Error", err);
//     }
// })
module.exports = router;
const express = require('express');
const router = express.Router();
const { getInformationFromAddress, getInformationFromIndex } = require('../services/userService.js');
const { createTransaction } = require('../services/transactionService.js');
const TxModel = require('../db/tx.js');
const AccModel = require('../db/account.js');
const DepositModel = require('../db/deposit.js');
const Account = require('../models/account.js');
const Transaction = require('../models/transaction.js');
const { buildEddsa, buildPoseidon } = require('circomlibjs');
const poseidon = require('../utils/poseidon.js');


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
        var data = {
            "fromX": req.body.fromX,
            "fromY": req.body.fromY,
            "index": req.body.index,
            "amount": req.body.amount

        }

        var depositData = new DepositModel(data);
        depositData.save();
        res.json(data)
    } catch (err) {
        console.error("Error POST /transactions");
        next(err)
    }
})

router.post("/transaction", async (req, res) => {
    var prvkey = Buffer.from(req.body.prvkey, "hex");
    var eddsa = await buildEddsa();
    var poseidon = await buildPoseidon();
    var account = new Account(prvkey, eddsa, poseidon);
    var fromX = account.poseidon.F.toObject(account.pubkey[0]).toString();
    var fromY = account.poseidon.F.toObject(account.pubkey[1]).toString();
    var fromIndex = req.body.fromIndex;
    var toX = req.body.toX;
    var toY = req.body.toY;
    var toIndex = req.body.toIndex;
    var nonce = req.body.nonce;
    var balance = req.body.balance;
    var tokenType = req.body.tokenType;
    try {
        var dataX = await AccModel.find({ fromX: fromX, fromY: fromY }).exec();
        if (dataX == null) {
            res.status(403).json({ message: "Not Found" });
        } else {
            var newTx = new Transaction(poseidon, fromX, fromY, fromIndex, toX, toY, toIndex, nonce, balance, tokenType)
            var data = await account.signTx(newTx);
            const txData = new TxModel(data);
            txData.save();
            res.json(data);
        }
    } catch (err) {
        console.error("Error", err.message);
    }

})

router.post("/wallet", async (req, res) => {
    try {
        var prvkey = Buffer.from(req.body.prvkey, "hex");
        var eddsa = await buildEddsa();
        var poseidon = await buildPoseidon();
        var account = new Account(prvkey, eddsa, poseidon);
        var fromX = account.poseidon.F.toObject(account.pubkey[0]).toString();
        var fromY = account.poseidon.F.toObject(account.pubkey[1]).toString();
        var dataX = await AccModel.find({ fromX: fromX, fromY: fromY }).exec();
        if (dataX.length != 0) {
            res.status(403).json({ message: "!Exist" });
        } else {
            var lastIndex = await AccModel.countDocuments({ name: 'accounts' }).exec();
            const data = {
                "index": lastIndex,
                "fromX": account.F.toObject(account.pubkey[0]).toString(),
                "fromY": account.F.toObject(account.pubkey[1]).toString(),
            }
            var accData = new AccModel(data);
            accData.save();
            res.json(data);
        }
    } catch (err) {
        console.error("Error", err.message);
    }
})
module.exports = router;
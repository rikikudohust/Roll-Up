const TreeModel = require('../../db/tree.js');
const DepositModel = require('../../db/deposit.js');
const { stringifyBigInts, unstringifyBigInts } = require('../../utils/stringifybigint.js');
const AccountTree = require('../../models/accountTree');
const Account = require('../../models/account.js')
const Tree = require('../../models/tree.js')
const AccountModel = require('../../db/account.js');
const loadTree = require('../loadTree.js');

const TX_DEPTH = 2;
const BAL_DEPTH = 4;
const zeroAccount = new Account('0');
const zeroHash = zeroAccount.hashAccount()
const numLeaves = 2 ** BAL_DEPTH;
const zeroLeaves = new Array(numLeaves).fill(zeroHash)
const zeroTree = new Tree(zeroLeaves);
var zeroCache = [stringifyBigInts(zeroHash)]
for (var i = BAL_DEPTH - 1; i >= 0; i--) {
    zeroCache.unshift(stringifyBigInts(zeroTree.innerNodes[i][0]))
}

module.exports = async function processDeposit(rollup,signer) {
    try {

        var depositData = await DepositModel.find().exec();
        if (depositData.length == 0) {
            return;
        }

        if(depositData.length % 2 != 0) {
            return;
        }

        var batch = await TreeModel.find().exec();
        var currentRoot = batch.slice(-1);

        var oldAccount  = await AccountModel.find().exec();
        var treeLeaf = new Array(BAL_DEPTH**2).fill(zeroHash);
        var depositId = [];
        var depositAccount = [];
        for (let i = 0; i < depositData.length; ++i) {
            var tmpAcc = new Account(currentRoot[0].account + i,BigInt(depositData[i].fromX),BigInt(depositData[i].fromY), depositData[i].amount, 0, depositData[i].tokenType);
            depositAccount.push(tmpAcc);
            depositId.push(depositData[i].id);

        }
        for (let i = 0; i < currentRoot[0].account; ++i) {
            treeLeaf[i] = (new Account(oldAccount[i].index, oldAccount[i].pubkeyX, oldAccount[i].pubkeyY, oldAccount[i].balance, oldAccount[i].nonce, oldAccount[i].tokenType)).hashAccount();
        }

        for (let i = 0;i < depositData.length; ++i) {
            treeLeaf[currentRoot[0].account + i] = (new Account(currentRoot[0].account + i,BigInt(depositData[i].fromX),BigInt(depositData[i].fromY), depositData[i].amount, 0, depositData[i].tokenType)).hashAccount();
        }
        var tree = new Tree(treeLeaf);

        if (depositData.length > 2) {
            return;
        }

        var proofData = (tree.getProof(currentRoot[0].account + 1, BAL_DEPTH));
        const subTreeProof = proofData.proof.slice(Math.log2(depositAccount.length), BAL_DEPTH);
        const subTreeProofPos = proofData.proofPos.slice(Math.log2(depositAccount.length), BAL_DEPTH);
        data = {
            subTreeDepth: Math.log2(depositAccount.length),
            subTreeProofPos: subTreeProofPos,
            subTreeProof: subTreeProof
        }
        var proof = [];
        for (let i = 0; i < subTreeProof.length; ++i) {
            proof.push(subTreeProof[i].toString());
        }
        console.log(data.subTreeDepth);
        console.log(data.subTreeProofPos);
        console.log(proof);
        var processDepositTx = await rollup.connect(signer).processDeposits(data.subTreeDepth, data.subTreeProofPos, proof);
        //const address1 = "0x5C057669CC676ba1747510974699DC8c8693E08F"
       // var processDepositTx = await rollup.methods.processDeposits(data.subTreeDepth, data.subTreeProofPos, proof).send({from:address1,gas:999999});
        await processDepositTx.wait();
        await AccountModel.insertMany(depositAccount);
        await DepositModel.deleteMany({id: depositId});
        await TreeModel({root: tree.root, account: currentRoot[0].account + depositData.length}).save();
    } catch(err) {
        console.log("Error", err);
    }
}

const TreeModel = require('../../db/tree.js');
const DepositModel = require('../../db/deposit.js');
const TxTree = require('../../models/txTree.js');
const AccountModel = require('../../db/account.js')
const Transaction = require('../../models/transaction.js');
const BlockModel = require('../../db/forceTx.js');

const TransactionModel = require('../../db/tx.js');
const loadTree = require('../loadTree');
const getCircuitInput = require('../../utils/circuitInput_validity.js')
const snarkjs = require('snarkjs');
const fs = require('fs');

const wasmFile = "/home/arsene_lupin/WorkSpace/BlockChain/Roll-Up/prover/proof/prepare_proof/multiple_tokens_transfer_and_withdraw_js/multiple_tokens_transfer_and_withdraw.wasm";
const zkeyFile = "/home/arsene_lupin/WorkSpace/BlockChain/Roll-Up/prover/proof/multiple_tokens_transfer_and_withdraw_final.zkey";
const vkeyFile = require("../../../../prover/proof/verification_key.json");

const TX_DEPTH = 2;

async function accountChange(txData) {
    var changeId = []
    var isAdd = new Array(4 ** 2).fill(false);
    for (var i = 0; i < txData.length; ++i) {
        if (!isAdd[txData[i].fromIndex]) {
            changeId.push(txData[i].fromIndex)
            isAdd[txData[i].fromIndex] = true;
        }
        if (!isAdd[txData[i].toIndex]) {
            changeId.push(txData[i].toIndex)
            isAdd[txData[i].toIndex] = true;
        }
    }
    return changeId;
}

module.exports = async function processTx(rollup, signer) {
    var current = await TreeModel.find().exec();
    var currentRoot = current.slice(-1);
    var transactionData = await TransactionModel.find().exec();
    if (transactionData.length != 4) {
        return;
    }
    if (transactionData.length == 0 || transactionData.length % 2 != 0) {
        return;
    }
    var transactionId = []
    for (var i = 0; i < transactionData.length; ++i) {
        transactionId[i] = transactionData[i].id;
    }
    var accountChangeId = await accountChange(transactionData);
    var currentTree = await loadTree();

    console.log(currentTree)
    txs = new Array(TX_DEPTH ** 2)
    for (var i = 0; i < txs.length; ++i) {
        if (i < transactionData.length) {
            // console.log(transactionData[i]
            var tx = new Transaction(BigInt(transactionData[i].fromX), BigInt(transactionData[i].fromY), transactionData[i].fromIndex, BigInt(transactionData[i].toX), BigInt(transactionData[i].toY), transactionData[i].toIndex, transactionData[i].nonce, transactionData[i].amount, transactionData[i].tokenType, BigInt(transactionData[i].R8x), BigInt(transactionData[i].R8y), BigInt(transactionData[i].S));
            txs[i] = tx;
        }
    }
    const txTree = new TxTree(txs);
    const stateTransition = currentTree.processTxArray(txTree);
    const inputs = getCircuitInput(stateTransition);
    console.log(inputs)
    // inputCircuit = JSON.parse(inputs).map((v) => v.toString());
    // console.log(inputCircuit)

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, wasmFile, zkeyFile);
    const updateA = [
        proof.pi_a[0], proof.pi_a[1]
    ]
    const updateB = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
    ]
    const updateC = [
        proof.pi_c[0], proof.pi_c[1]
    ]
    var verify = await snarkjs.groth16.verify(vkeyFile, publicSignals, proof);
    console.log(publicSignals);
    console.log(verify);
    if (verify) {
        var updateStateTx = await rollup.connect(signer).updateState(updateA, updateB, updateC, publicSignals);
        await updateStateTx.wait()
        await BlockModel.insertMany(transactionData);
        await TransactionModel.deleteMany({ id: transactionId })
        for (var i = 0; i < accountChangeId.length; ++i) {
            var index = accountChangeId[i];
            var newBalance = ((currentTree.accounts)[index]).balance;
            var newNonce = ((currentTree.accounts)[index]).nonce;
            await AccountModel.findOneAndUpdate({ index: index }, { balance: newBalance, nonce: newNonce }, { upsert: true });
        }

        await TreeModel({ root: currentTree.root, account: currentRoot[0].account }).save();
    }
}
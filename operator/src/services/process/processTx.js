const TreeModel = require('../../db/tree.js');
const AccountModel = require('../../db/account.js')
const BlockModel = require('../../db/forceTx.js');
const TransactionModel = require('../../db/transaction.js');

const TxTree = require('../../models/txTree.js');
const AccountTree = require('../../models/accountTree')
const Account = require('../../models/account.js');
const Transaction = require('../../models/transaction.js');


const getCircuitInput = require('../../utils/circuitInput_validity.js')
const snarkjs = require('snarkjs');

const wasmFile = "../prover/proof/prepare_proof/multiple_tokens_transfer_and_withdraw_js/multiple_tokens_transfer_and_withdraw.wasm";
const zkeyFile = "../prover/proof/multiple_tokens_transfer_and_withdraw_final.zkey";
const vkeyFile = require("../../../../prover/proof/verification_key.json");


const TX_DEPTH = 2;
const BAL_DEPTH = 4;

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

function optimalTransaction(transactionSize) {
    if (transactionSize >= 4) {
        return 4;
    } else {
        return 2;
    }
}

module.exports = async function processTx(rollup, signer) {
    var currentTree = await TreeModel.find().sort({ _id: -1 }).limit(1);
    var currentTreeRoot = currentTree[0];
    var transactionDataSize = await TransactionModel.count().exec();
    if (transactionDataSize != 4) {
        return;
    }
    var currentAccount = await AccountModel.find();

    var TPB = optimalTransaction(transactionDataSize);

    var transactionData = await TransactionModel.find().limit(TPB);

    var transactionId = []
    for (var i = 0; i < transactionData.length; ++i) {
        transactionId[i] = transactionData[i].id;
    }
    var accountChangeId = await accountChange(transactionData);

    var zeroAccount = new Account();
    var accountLeaves = new Array(2 ** BAL_DEPTH).fill(zeroAccount);
    var depositLeaves = [];
    for (let i = 0; i < currentAccount.length; i++) {
        console.log("i: ", i)
        console.log(currentAccount[i].index)
        var tmpAccount = new Account(
            currentAccount[i].index,
            currentAccount[i].pubkeyX,
            currentAccount[i].pubkeyY,
            currentAccount[i].balance,
            currentAccount[i].nonce,
            currentAccount[i].tokenType,
            currentAccount[i].l1Address
        )
        accountLeaves[i] = tmpAccount;
    }

    var newAccountTree = new AccountTree(accountLeaves);



    txs = new Array(TPB)
    for (var i = 0; i < txs.length; ++i) {
        if (i < transactionData.length) {
            var tx = new Transaction(BigInt(transactionData[i].fromX), BigInt(transactionData[i].fromY), transactionData[i].fromIndex, BigInt(transactionData[i].toX), BigInt(transactionData[i].toY), transactionData[i].toIndex, transactionData[i].nonce, transactionData[i].amount, transactionData[i].tokenType, BigInt(transactionData[i].R8x), BigInt(transactionData[i].R8y), BigInt(transactionData[i].S));
            txs[i] = tx;
        }
    }
    console.log(txs)
    const txTree = new TxTree(txs);
    const stateTransition = newAccountTree.processTxArray(txTree);
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
        // var updateStateTx = await rollup.connect(signer).updateState(updateA, updateB, updateC, publicSignals);
        // await updateStateTx.wait()
        await BlockModel.insertMany(transactionData);
        await TransactionModel.deleteMany({ id: transactionId })
        for (var i = 0; i < accountChangeId.length; ++i) {
            var index = accountChangeId[i];
            var newBalance = ((newAccountTree.accounts)[index]).balance;
            var newNonce = ((newAccountTree.accounts)[index]).nonce;
            await AccountModel.findOneAndUpdate({ index: index }, { balance: newBalance, nonce: newNonce }, { upsert: true });
        }

        const C = await TreeModel({index: currentTree[0].index + 1, root: newAccountTree.root, leafNodes: newAccountTree.leafNodes, depth: newAccountTree.depth, innerNodes: newAccountTree.innerNodes}).save();
    }
}
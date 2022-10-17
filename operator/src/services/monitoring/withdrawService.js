const WithdrawModel = require('../../db/withdraw')
const AccountModel = require('../../db/account')
const TransactionModel = require('../../db/transaction')
const ForceTxModel = require('../../db/forceTx')

const Transaction = require('../../models/transaction');
const Tree = require('../../models/tree');

const poseidon = require('../../utils/poseidon');
const eddsa = require('../../utils/eddsa');

const snarkjs = require('snarkjs');

const wasmWithdraw = "../prover/proof/prepare_proof/withdraw_js/withdraw.wasm";
const zkeyWithdraw = "../prover/proof/withdraw_final.zkey";

async function withdrawToL1(data) {
    var fromX = data.fromX;
    var fromY = data.fromY;
    var toX = 0;
    var toY = 0;
    var nonce = data.nonce;
    var amount = data.amount;
    var tokenType = data.tokenType;
    var recipient = data.recipient;
    var l2Signature = data.l2Signature;
    var l1Signature = data.l1Signature;

    var fromData = await AccountModel.findOne({ pubkeyX: fromX, pubkeyY: fromY }).exec();
    var toData = await AccountModel.findOne({ pubkeyX: toX, pubkeyY: toY }).exec();
    if (fromData == null || toData == null) {
        throw new Error("Account not exist");
    }

    var newTransaction = new Transaction(
        fromData.pubkeyX,
        fromData.pubkeyY,
        fromData.index,
        toData.pubkeyX,
        toData.pubkeyY,
        toData.index,
        nonce,
        amount,
        tokenType,
        BigInt(l2Signature.R8x),
        BigInt(l2Signature.R8y),
        BigInt(l2Signature.S)
    )

    newTransaction.checkSignature();

    // Check l1 Signature

    var l1Signed = {
        R8: [BigInt(l1Signature.R8x), BigInt(l1Signature.R8y)],
        S: BigInt(l1Signature.S)
    }
    const hashWithdraw = poseidon([nonce.toString(), recipient.toString()]);
    const withdrawSigned = eddsa.verifyPoseidon(hashWithdraw, l1Signed, [BigInt(fromData.pubkeyX), BigInt(fromData.pubkeyY)]);
    if (!withdrawSigned) {
        throw new Error("Invalid l1 signature");
    }

    const withdrawInputCircuit = {
        Ax: fromData.pubkeyX,
        Ay: fromData.pubkeyY,
        R8x: l1Signed.R8[0].toString(),
        R8y: l1Signed.R8[1].toString(),
        S: l1Signed.S.toString(),
        M: hashWithdraw.toString()
    }

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(withdrawInputCircuit, wasmWithdraw, zkeyWithdraw);
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

    newWithdrawProof = {
        hashWithdraw: newTransaction.hashTx(),
        pubkeyX: fromX,
        pubkeyY: fromY,
        index: fromData.index,
        nonce: nonce,
        amount: amount,
        recipient: recipient,
        updateA: updateA,
        updateB: updateB,
        updateC: updateC
    }

    const withdrawProof = new WithdrawModel(newWithdrawProof);

    const withdrawData = new TransactionModel(newTransaction);

    await withdrawProof.save();
    await withdrawData.save();

    // return JSON.parse(JSON.stringify(newTransaction, (key, value) =>
    //     typeof value === 'bigint'
    //         ? value.toString()
    //         : value // return everything else unchanged
    // ));
    return {
        message: "success"
    }
}

async function getAllWithdrawProof(userAddress) {
    var withdrawAccount = await WithdrawModel.find({ recipient: userAddress });
    proof = [];
    for (let i = 0; i < withdrawAccount.length; ++i) {
        var hashTmp = withdrawAccount[i].hashWithdraw;
        var withdrawTxTmp = await ForceTxModel.findOne({ hash: hashTmp });
        var transactionTree = await ForceTxModel.find({ block: withdrawTxTmp.block });
        console.log(transactionTree)
        var treeLeaves = [];
        var tmpIndex;
        for (let i = 0; i < transactionTree.length; ++i) {
            treeLeaves.push(transactionTree[i].hash);
            if (hashTmp == transactionTree[i].hash) {
                tmpIndex = i;
            }
        }
        var tmpTree = new Tree(treeLeaves);
        proofData = tmpTree.getProof(tmpIndex, tmpTree.depth);
        tmpData = {
            txInfo: [withdrawTxTmp.fromX, withdrawTxTmp.fromY, withdrawTxTmp.fromIndex.toString(), "0", "0", withdrawTxTmp.nonce.toString(), withdrawTxTmp.amount.toString(),withdrawTxTmp.tokenType ,tmpTree.root.toString()],
            position: proofData.proofPos,
            proof: proofData.proof.map(v => v.toString()),
            recipient: userAddress,
            A: withdrawAccount[i].updateA,
            B: withdrawAccount[i].updateB,
            C: withdrawAccount[i].updateC
        }

        proof.push(tmpData)
    }

    return proof;
}

module.exports = {
    withdrawToL1,
    getAllWithdrawProof
}
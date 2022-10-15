const TransactionModel = require('../../db/forceTx.js');
const AccountModel = require('../../db/account.js');
const TransactionPendingModel = require('../../db/transaction.js');

const Transaction = require('../../models/transaction');

async function getTransactions() {
    var transactionData = await TransactionModel.find().exec();
    return transactionData;

}

async function getTransactionById(index) {
    var transactionData = await TransactionModel.find({ fromIndex: index }).exec();
    return transactionData;
}

async function getTransactionByAddress(address) {
    var accountData = await AccountModel.findOne({ ethAddress: address }).exec();
    var accountIndex = accountData.index;
    var transactionData = await TransactionModel.find({
        $or: [
            { 'fromIndex': accountIndex },
            { 'toIndex': accountIndex }
        ]
    }).exec();

    return transactionData;
}

async function getPendingTransactionByAddress(address) {
    var accountData = await AccountModel.find({ ethAddress: address }).exec();
    var accountIndex = accountData[0].index;
    var transactionData = await TransactionPendingModel.findOne({
        $or: [
            { 'fromIndex': accountIndex },
            { 'toIndex': accountIndex }
        ]
    }).exec();

    return transactionData;
}


async function postTransaction(data) {
    var fromX = data.fromX;
    var fromY = data.fromY;
    var toX = data.toX;
    var toY = data.toY;
    var amount = data.amount;
    var tokenType = data.tokenType;
    var signature = data.signature;

    var fromData = await AccountModel.findOne({ pubkeyX: fromX , pubkeyY: fromY}).exec();
    var toData = await AccountModel.findOne({ pubkeyX: toX , pubkeyY: toY }).exec();
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
        fromData.nonce,
        amount,
        tokenType,
        BigInt(signature.R8x),
        BigInt(signature.R8y),
        BigInt(signature.S)
    )

    newTransaction.checkSignature();

    const transactionData = new TransactionPendingModel(newTransaction);
    transactionData.save();
    return JSON.parse(JSON.stringify(newTransaction, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}

module.exports = {
    getTransactions,
    getTransactionById,
    getTransactionByAddress,
    getPendingTransactionByAddress,
    postTransaction
}
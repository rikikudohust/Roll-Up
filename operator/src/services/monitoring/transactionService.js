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
    var accountData = await AccountModel.findOne({ l1Address: address }).exec();
    if (accountData == null) {
        return [];
    }
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
    var accountData = await AccountModel.find({ l1Address: address }).exec();
    if (accountData.length == 0) {
        return [];
    }
    var accountIndex = accountData[0].index;
    var transactionData = await TransactionPendingModel.find({
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
    var nonce = data.nonce;
    var amount = data.amount;
    var tokenType = data.tokenType;
    var signature = data.signature;

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

async function getTransactionDetail(data) {
    fromAddress = data.fromAddress;
    toAddress = data.toAddress;

    fromAccount = await AccountModel.findOne({ l1Address: fromAddress }).exec();
    toAccount = await AccountModel.findOne({ l1Address: toAddress }).exec();

    if (fromAccount == null || toAccount == null) {
        throw new Error("Invalid acount data");
    }

    transactionData = {
        fromX: fromAccount.pubkeyX,
        fromY: fromAccount.pubkeyY,
        fromIndex: fromAccount.index,
        toX: toAccount.pubkeyX,
        toY: toAccount.pubkeyY,
        toIndex: toAccount.index,
        amount: data.amount,
        nonce: fromAccount.nonce,
        tokenType: data.tokenType
    }

    return transactionData;
}

async function postTestTransaction(data) {
    var fromAddress = data.fromAddress;
    var toAddress = data.toAddress;
    var amount = data.amount;
    var tokenType = data.tokenType;
    var prv = data.prvkey;

    fromAccount = await AccountModel.findOne({ l1Address: fromAddress }).exec();
    toAccount = await AccountModel.findOne({ l1Address: toAddress }).exec();

    if (fromAccount == null || toAccount == null) {
        throw new Error("Invalid acount data");
    }

    var newTransaction = new Transaction(
        fromAccount.pubkeyX,
        fromAccount.pubkeyY,
        fromAccount.index,
        toAccount.pubkeyX,
        toAccount.pubkeyY,
        toAccount.index,
        fromAccount.nonce,
        data.amount,
        data.tokenType
    )

    newTransaction.signTxHash(Buffer.from(prv, "hex"));
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
    postTransaction,
    getTransactionDetail,
    postTestTransaction
}
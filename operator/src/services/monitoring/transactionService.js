const TransactionModel = require('../../db/forceTx.js');

async function getAllTransaction() {
    var transactionData = await TransactionModel.find().exec();
    return transactionData;

}

async function getTransactionByIndex(index) {
    var transactionData = await TransactionModel.find({fromIndex:index}).exec();
    return transactionData;
}

module.exports = {
    getAllTransaction,
    getTransactionByIndex
}
const AccountModel =  require('../../db/account.js');
const eddsa = require('../../utils/eddsa.js');

async function getAccountByIndex(userId) {
    var userData = await AccountModel.findOne({index: userId}).exec();
    return userData;
}

async function getAccountByAddress(address) {
    var userData = await AccountModel.findOne({l1Address: address}).exec();
    return userData;
}

async function getAllAccounts() {
    var userData = await AccountModel.find().exec();
    return userData;
}

module.exports = {
    getAccountByAddress,
    getAllAccounts,
    getAccountByIndex
}

const DepositModel = require('../../db/deposit');
const AccountModel = require('../../db/account');

async function depositL2(l1Address,fromX, fromY, amount, tokenType) {
    var datax = await AccountModel.findOne({l1Address: l1Address}).exec();
    if (datax != null) {
        throw new Error("!Account Exist");
    } else {
        var data = {
            "l1Address": l1Address,
            "fromX": fromX,
            "fromY": fromY,
            "tokenType": tokenType,
            "amount": amount,
        }
        var depositData = new DepositModel(data);
        depositData.save();
        return data;
    }
}

async function getPendingDeposit() {
    var depositPendingData = await DepositModel.find().exec();
    return depositPendingData;
}

async function getPendingDepositByAddress(address) {
    console.log(address)
    var depositPendingData = await DepositModel.find({l1Address: address}).exec();
    return depositPendingData;
}

module.exports = {
    depositL2,
    getPendingDeposit,
    getPendingDepositByAddress
}
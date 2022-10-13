const AccountModel =  require('../../db/account.js');

async function getInformationFromIndex(userId) {
    var userData = await AccountModel.find({index: userId}).exec();
    return userData;
}

module.exports = {
    getInformationFromIndex
}

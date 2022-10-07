const Account = require('../models/account.js');
const AccountModel = require('../db/account.js');
const AccountTree = require('../models/accountTree.js');

module.exports = async function loadTree() {
    var dataAccount = await AccountModel.find().exec();
    var accounts = [];
    for (let i = 0; i < dataAccount.length; ++i) {
        var account = new Account(
                                  dataAccount[i].index,
                                  BigInt(dataAccount[i].pubkeyX), 
                                  BigInt(dataAccount[i].pubkeyY),
                                  dataAccount[i].balance,
                                  dataAccount[i].nonce,
                                  dataAccount[i].tokenType
                                  );
        accounts.push(account);
    }
    for (let i = 0; i < 16 - dataAccount.length; ++i) {
        var tmpAccount = new Account();
        accounts.push(tmpAccount);
    }
    var accountTree = await new AccountTree(accounts);
    return accountTree;
}


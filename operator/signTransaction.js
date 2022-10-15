
const mongoose = require('mongoose')
const Transaction = require('./src/models/transaction');
const AccountModel = require('./src/db/account');
const fs = require('fs');

const dbURL = 'mongodb://test:test@localhost:27027/rollup';
mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

async function signTransaction(prvkey, fromIndex, toIndex, amount, tokenType) {
    var AccountFrom = await AccountModel.findOne({ index: fromIndex });
    var AccountTo = await AccountModel.findOne({ index: toIndex });

    var newTransaction = new Transaction(
        AccountFrom.pubkeyX,
        AccountFrom.pubkeyY,
        AccountFrom.index,
        AccountTo.pubkeyX,
        AccountTo.pubkeyY,
        AccountTo.index,
        AccountFrom.nonce,
        amount,
        tokenType
    )

    newTransaction.signTxHash(Buffer.from(prvkey, "hex"));
    newTransaction.checkSignature();
    return {
        fromX: (newTransaction.fromX).toString(),
        fromY: (newTransaction.fromY).toString(),
        fromIndex: (newTransaction.fromIndex).toString(),
        toX: (newTransaction.toX).toString(),
        toY: (newTransaction.toY).toString(),
        toIndex: (newTransaction.toIndex).toString(),
        amount: newTransaction.amount,
        nonce: (newTransaction.nonce),
        tokenType: (newTransaction.tokenType),
        signature: {
            R8x: (newTransaction.R8x).toString(),
            R8y: (newTransaction.R8y).toString(),
            S: (newTransaction.S).toString()
        }
    };
}

main = async () => {
    prvkey = ["59dccb02c10ebb2e1e7305c7a84a34f79cc68316926adcb04a9835ec850210a1", "bc7926f6d6c4f792be56f4df0a285d579d9fd7d4dd328a01ecb9e71f627afdb6", "358166546eb5ab98f5f9f9f7b094a536dc0dc5e197ee6dca7177cb747167077c", "1e097a61aa6ba35c12613c46a9ff2dc58e6a0a4e066c2f7b79162c8427196445"];
    fromIndex = [1, 5, 3, 4];
    toIndex = [5, 3, 4, 1];
    amount = [10, 20, 20, 10];
    tokenType = [1, 1, 1, 1];
    dataJson = []
    for (let i = 0; i < amount.length; ++i) {
        transactionData = await signTransaction(prvkey[i], fromIndex[i], toIndex[i], amount[i], tokenType[i]);
        dataJson.push(transactionData);
    }

    fs.writeFileSync(
        "./tmp/input.json",
        JSON.stringify(dataJson, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ),
        "utf-8"
    );

}

main().then;
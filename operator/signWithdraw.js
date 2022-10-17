
const mongoose = require('mongoose')
const Transaction = require('./src/models/transaction');
const AccountModel = require('./src/db/account');
const fs = require('fs');
const poseidon = require('./src/utils/poseidon');
const eddsa = require('./src/utils/eddsa');
const { unstringifyBigInts } = require('./src/utils/stringifybigint');


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

async function signWithdraw(prvkey, fromIndex, recipient) {
    var AccountFrom = await AccountModel.findOne({ index: fromIndex });
    var AccountTo = await AccountModel.findOne({ index: toIndex });

    var hashWithdraw = poseidon([AccountFrom.nonce.toString(), recipient.toString()])
    const newSign = eddsa.signPoseidon(Buffer.from(prvkey, "hex"), unstringifyBigInts(hashWithdraw));
    return {
        R8x: newSign.R8[0].toString(),
        R8y: newSign.R8[1].toString(),
        S: newSign.S.toString()
    }
}

main = async () => {
    prvkey = ["bc7926f6d6c4f792be56f4df0a285d579d9fd7d4dd328a01ecb9e71f627afdb6"]
    fromIndex = [1];
    toIndex = [0];
    amount = [10];
    tokenType = [1];
    recipient = ["0xbD3342841b811fA57C54D1470785cd6b36EB65D9"];
    dataJson = []
    withdrawJson = []
    for (let i = 0; i < amount.length; ++i) {
        transactionData = await signTransaction(prvkey[i], fromIndex[i], toIndex[i], amount[i], tokenType[i]);
        withdrawData = await signWithdraw(prvkey[i], fromIndex[i], recipient[i])
        dataJson.push(transactionData);
        withdrawJson.push(withdrawData);
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

    fs.writeFileSync(
        "./tmp/withdrawInput.json",
        JSON.stringify(withdrawJson, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ),
        "utf-8"
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
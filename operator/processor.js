const mongoose = require('mongoose');
const TxModel = require('./src/db/tx.js');
const AccountModel = require('./src/db/account.js');
const DepositModel  = require('./src/db/deposit.js');
const {newLevelDbRollupTree}=  require('./src/utils/rollup-tree.js');
const Scalar = require('ffjavascript').Scalar;
const dbURL = 'mongodb://test:test@localhost:27027/rollup';
const pathDB = `${__dirname}/tmp`;

const connectDB = async () => {
    try {
        console.log("Test");
        database = await mongoose.connect(dbURL);
        console.log("Connected Db");
    } catch (err) {
        console.error("Failed to connect DB", err);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    var balanceTree = await newLevelDbRollupTree(pathDB);
    var F = await balanceTree.smt.F;
    await connectDB();
    while (1) {
        data = await DepositModel.find().exec();
        console.log(data);
        // await balanceTree.addId(Scalar.e(data[0].index), Scalar.e(data[0].amount), Scalar.e(1), Scalar.e(data[0].fromX), Scalar.e(data[0].fromY), Scalar.e(0));
        // console.log("here")
        console.log(await balanceTree.getRoot())
        console.log(await balanceTree.getIdInfo(1));
        await sleep(10000);
    }
}

main().then
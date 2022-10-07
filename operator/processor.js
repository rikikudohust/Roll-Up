const mongoose = require('mongoose');
const DepositModel = require('./src/db/deposit.js');
const TreeModel = require('./src/db/tree.js');
const dbURL = 'mongodb://test:test@localhost:27027/rollup';
const Account = require('./src/models/account.js');
const loadTree = require('./src/services/loadTree.js');
const { ethers } = require('hardhat');
const rollUpContract = require('./src/services/contract/rollUpContract.js');
const { stringifyBigInts, unstringifyBigInts } = require('./src/utils/stringifybigint.js')
const Tree = require('./src/models/tree.js')
const processDeposit = require('./src/services/process/processDeposit.js');
const processTx = require('./src/services/process/processTx.js');
const generateState = require('./src/services/process/generateState.js')

require('dotenv').config();
const provider = new ethers.providers.JsonRpcProvider(process.env.TESTNETBSC);

mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const TX_DEPTH = 2;
const BAL_DEPTH = 4;
const zeroAccount = new Account('0');
const zeroHash = zeroAccount.hashAccount()
const numLeaves = 2 ** BAL_DEPTH;
const zeroLeaves = new Array(numLeaves).fill(zeroHash)
const zeroTree = new Tree(zeroLeaves);
var zeroCache = [stringifyBigInts(zeroHash)]
for (var i = BAL_DEPTH - 1; i >= 0; i--) {
    zeroCache.unshift(stringifyBigInts(zeroTree.innerNodes[i][0]))
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    var rollup = await rollUpContract(process.env.rollUpAddress, provider);
    var signer =  new ethers.Wallet(process.env.KEY_1, provider);
    await generateState(rollup, signer);
    while (1) {
        // Process Deposit
        console.log("Process Deposit")
        await processDeposit(rollup, signer);
        console.log("Process Deposit Successfully")
        console.log("Process Transaction")
        await processTx(rollup, signer);
        console.log("Process Transaction Successfully")
        await sleep(10000);
    }
}

main().then

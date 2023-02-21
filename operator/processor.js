const mongoose = require('mongoose');
const { ethers } = require('hardhat');
const rollUpContract = require('./src/services/contract/rollUpContract.js');

const processDeposit = require('./src/services/process/processDeposit.js');
const processTx = require('./src/services/process/processTx.js');
const generateState = require('./src/services/process/generateState.js')

require('dotenv').config();
const provider = new ethers.providers.JsonRpcProvider(process.env.TESTNETBSC);

const dbURL ="mongodb://test:test@127.0.0.1:27027/rollup";
mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

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
        await sleep(30000);
    }
}

main().then

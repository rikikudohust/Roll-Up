require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const { resolve } = require("path");
const { config } = require("dotenv");
require("@openzeppelin/hardhat-upgrades");

config({ path: resolve(__dirname, "./.env") });

var accounts;
if (process.env.MNEMONIC)
    accounts = {
        count: 10,
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
    };
else if (process.env.KEYS)
    accounts = process.env.KEYS.split(" ").map((key) => ({
        privateKey: key,
        balance: 1000000000,
    }));
else throw new Error("Must provide mnemonic/keys (env)!");

const networks = {
    hardhat: {
        accounts: accounts,
        mining: {
            mempool: {
                order: "fifo",
            },
        },
        chainId: 31337,
    },
    testnetbsc: {
        url: "https://data-seed-prebsc-2-s1.binance.org:8545/",
        chainId: 97,
        gasPrice: 20000000000,
        gasMultiplier: 2,
        accounts: [process.env.KEY_1, process.env.KEY_2],
    },
    mainnetbsc: {
        url: "https://bsc-dataseed.binance.org/",
        chainId: 56,
        accounts: [process.env.KEY_1],
    }
};

module.exports = {
    defaultNetwork: "hardhat",
    networks: networks,
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
    solidity: {
        compilers: [{
                version: "0.8.11",
                settings: {
                    metadata: { bytecodeHash: "none" },
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.6.12",
                settings: { optimizer: { enabled: true, runs: 100 } },
            },
        ],
        settings: {
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
    },
};
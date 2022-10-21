const bip39 = require('bip39');
const hdkey = require('hdkey');
const eddsa = require('../../utils/eddsa');

async function genereteNewWallet() {
    const rootPath = "m/44'/60'/0'/0/0"
    const randMnemonic = bip39.generateMnemonic();
    const root = hdkey.fromMasterSeed(randMnemonic);
    const node = root.derive(rootPath);
    const nodeEddsa = node.derive(`m/0`);
    // const privateKey = nodeEddsa.privateKey;
    const privateKey = Buffer.from("358166546eb5ab98f5f9f9f7b094a536dc0dc5e197ee6dca7177cb747167077c","hex")
    const publicKey = eddsa.prv2pub(privateKey);
    return {
        private_key: privateKey.toString("hex"),
        public_key: publicKey.map(v => v.toString())
    };
}

module.exports = {
    genereteNewWallet
}
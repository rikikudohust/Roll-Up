const {buildEddsa, buildBabyjub, buildPoseidon} = require('circomlibjs');
const { model } = require('mongoose');
const { unstringifyBigInts } = require('../utils/stringifybigint');

module.exports = class Account {
    constructor(
        _prvkey,
        eddsa,
        poseidon
    ) {
        this.prvkey = _prvkey;
        this.eddsa = eddsa,
        this.pubkey = this.eddsa.prv2pub(this.prvkey);
        this.poseidon = poseidon;
        this.F = poseidon.F;
    }

    async signTx(tx) {
        const txHash = await tx.hashTx();
        const signature = this.eddsa.signPoseidon(this.prvkey,txHash);
        tx.R8x = this.F.toObject(signature.R8[0]).toString();
        tx.R8y = this.F.toObject(signature.R8[1]).toString();
        tx.S = signature.S.toString();
        var data = await tx.inforTx();
        return data;
    } 
}

// async function buildAccount(prvkey) {
//     var eddsa  = await buildEddsa();
//     var poseidon = await buildPoseidon();
//     var account = new Account(prvkey, eddsa, poseidon);
//     return account;
// }

// module.exports = {
//     buildAccount,
//     Account
// }
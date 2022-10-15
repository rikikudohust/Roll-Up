const eddsa = require("../src/eddsa.js")
const fs = require("fs");
const Tree = require("../src/tree")
const Account = require("../src/account.js");
const AccountTree = require("../src/accountTree.js");
const Transaction = require("../src/transaction.js");
const TxTree = require("../src/txTree.js");
const treeHelper = require("../src/treeHelper.js");
const getCircuitInput = require("../src/circuitInput_validity.js");
const {stringifyBigInts, unstringifyBigInts} = require('../src/stringifybigint.js')


function generatePubkey(prvkey){
    pubkey = eddsa.prv2pub(prvkey);
    return pubkey; 
}
console.log(generatePubkey(Buffer.from('c7af88b6c3f1e5248c135f90c89d8c52ff6e5865592ee4b3d23a5f37c9820b52', "hex")));
console.log(generatePubkey(Buffer.from('c8ed81159aa714f6c87524a5216eb9f1f2dcfd70eab57cb5d0922696038db043', "hex")));
console.log(generatePubkey(Buffer.from('b54a8a2a173901bcaf0d4c7708d8746ecc09fc492613d55920058dfafe252552', "hex")));
console.log(generatePubkey(Buffer.from('dde6abc45b3b0405b8380c5bc1d00280ee39222cf0b43622d7635e8878f9deab', "hex")));
console.log(generatePubkey(Buffer.from('554c379320ee9636d78518d8f9a387ba76942bbe0eb9f579d426b3c9b19018c1', "hex")));

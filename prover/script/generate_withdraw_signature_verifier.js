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
const poseidon = require("../src/poseidon.js");
// const TX_DEPTH = 8
// const BAL_DEPTH = 12

const TX_DEPTH = 2
const BAL_DEPTH = 4


// get empty account tree hashes
const zeroAccount = new Account();
const zeroHash = zeroAccount.hashAccount()
const numLeaves = 2**BAL_DEPTH;
const zeroLeaves = new Array(numLeaves).fill(zeroHash)
const zeroTree = new Tree(zeroLeaves);
var zeroCache = [stringifyBigInts(zeroHash)]

var accounts = [zeroAccount];

function generatePrvkey(i){
    prvkey = Buffer.from(i.toString().padStart(64,'0'), "hex");
    return prvkey;  
}

function generatePubkey(prvkey){
    pubkey = eddsa.prv2pub(prvkey);
    return pubkey; 
}

const PrvKey = generatePrvkey(2);
const PubKey = generatePubkey(PrvKey);

const nonce = 1 ;
const recipient ="0x1EE0FAb34eFA8D4D8281D870350ED23B369E56F0";
const hashWithdraw = poseidon([nonce.toString(),recipient.toString()])
const signature = eddsa.signPoseidon(PrvKey, unstringifyBigInts(hashWithdraw));

const inputs = {
    Ax: PubKey[0],
    Ay: PubKey[1],
    R8x: signature.R8[0],
    R8y: signature.R8[1],
    S: signature.S,
    M: hashWithdraw
}

fs.writeFileSync(
    "../input/withdraw_input.json",
    JSON.stringify(inputs, (key, value) => 
        typeof value === 'bigint'
            ? value.toString() 
            : value // return everything else unchanged
    ),
    "utf-8"
);
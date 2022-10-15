const TreeModel = require('../../db/tree.js');
const { stringifyBigInts, unstringifyBigInts } = require('../../utils/stringifybigint.js');
const Account = require('../../models/account.js')
const Tree = require('../../models/tree.js')
const AccountModel = require('../../db/account.js');



module.exports = async function generateState(rollup, signer) {
    try {
        var tree = await TreeModel.find().exec();
        if (tree.length != 0) {
            return;
        }

        const TX_DEPTH = 2;
        const BAL_DEPTH = 4;
        const zeroAccount = new Account();
        const zeroHash = zeroAccount.hashAccount()
        const numLeaves = 2 ** BAL_DEPTH;
        const zeroLeaves = new Array(numLeaves).fill(zeroHash)
        const zeroTree = new Tree(zeroLeaves);
        var zeroCache = [stringifyBigInts(zeroHash)]
        for (var i = BAL_DEPTH - 1; i >= 0; i--) {
            zeroCache.unshift(stringifyBigInts(zeroTree.innerNodes[i][0]))
        }

        const A = await AccountModel(zeroAccount).save();
        const B = await TreeModel({
            index: 0,
            leafNodes: zeroTree.leafNodes,
            depth: BAL_DEPTH,
            root: zeroTree.root,
            innerNodes: zeroTree.innerNodes
        }).save(opts);

        console.log("State Initialized");
        return;
    } catch (err) {
        console.log("Error", err);
    }
}

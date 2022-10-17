const TreeModel = require('../../db/tree.js');
const DepositModel = require('../../db/deposit.js');
const AccountModel = require('../../db/account.js');
const { stringifyBigInts, unstringifyBigInts } = require('../../utils/stringifybigint.js');
const Account = require('../../models/account.js')
const Tree = require('../../models/tree.js')

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

function calculateOptimalDeposit(accountSize, pendingDepositSize) {
    var limit = 0;
    if (accountSize % 2 != 0) {
        limit = 1;
    } else if (accountSize % 4 == 0) {
        limit = 4;
    } else {
        limit = 2;
    }

    dataProcess = (limit < pendingDepositSize ? limit : pendingDepositSize);
    return  dataProcess;
}

module.exports = async function processDeposit(rollup, signer) {
    try {
        var currentAccount = await AccountModel.find().exec();
        var accountSize = currentAccount.length;
        var depositPendingSize = await DepositModel.count().exec();
        var limitProcess = calculateOptimalDeposit(accountSize, depositPendingSize);
        if (depositPendingSize == 0) {
            return;
        }
        var depositPendingData = await DepositModel.find().limit(limitProcess).exec();

        var currentTree = await TreeModel.find().sort({ _id: -1 }).limit(1);
        var accountLeaves = new Array(2 ** BAL_DEPTH).fill(zeroAccount);
        var depositLeaves = [];
        for (let i = 0; i < accountSize; ++i) {
            var tmpAccount = new Account(
                currentAccount[i].index,
                currentAccount[i].pubkeyX,
                currentAccount[i].pubkeyY,
                currentAccount[i].balance,
                currentAccount[i].nonce,
                currentAccount[i].tokenType,
                currentAccount[i].l1Address
            )
            accountLeaves[i] = tmpAccount;
        }

        var depoistId = []
        for (let i = 0; i < limitProcess; ++i) {
            var tmpAccount = new Account(
                accountSize + i,
                depositPendingData[i].fromX,
                depositPendingData[i].fromY,
                depositPendingData[i].amount,
                0,
                depositPendingData[i].tokenType,
                depositPendingData[i].l1Address
            )
            accountLeaves[accountSize + i] = tmpAccount;
            depositLeaves.push(tmpAccount);
            depoistId.push(depositPendingData[i]._id);
        }
        var newTree = new Tree(accountLeaves.map(v => v.hash));
        // var newDepositTree = new Tree(depositLeaves);

        var proofData = (newTree.getProof( accountSize, BAL_DEPTH));
        const subTreeProof = proofData.proof.slice(Math.log2(limitProcess), BAL_DEPTH);
        const subTreeProofPos = proofData.proofPos.slice(Math.log2(limitProcess), BAL_DEPTH);
        var proofDepositData = {
            subTreeDepth: Math.log2(limitProcess),
            subTreeProofPos: subTreeProofPos,
            subTreeProof: subTreeProof.map(v => v.toString())
        }
        console.log(proofDepositData)

        var processDepositTx = await rollup.connect(signer).processDeposits(proofDepositData.subTreeDepth, proofDepositData.subTreeProofPos, proofDepositData.subTreeProof);
        await processDepositTx.wait();

        const A = await AccountModel.insertMany(depositLeaves);
        const B = await DepositModel.deleteMany({_id:depoistId});
        const C = await TreeModel({index: currentTree[0].index + 1, root: newTree.root, leafNodes: newTree.leafNodes, depth: newTree.depth, innerNodes: newTree.innerNodes}).save();

        console.log("Update Process Deposit Success");
        return;
    } catch (err) {
        console.log("Error", err);
    }
}

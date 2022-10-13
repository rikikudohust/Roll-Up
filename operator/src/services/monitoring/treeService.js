const TreeModel = require('../../db/tree.js');
const loadTree = require('../loadTree.js');

async function getCurrentTree() {
    var TreeData = await loadTree();
    return TreeData;
}

module.exports = {getCurrentTree}

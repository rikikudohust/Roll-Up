const mongoose = require('mongoose');
const treeSchema = new mongoose.Schema({
    index: {
        require: true,
        type: Number
    },
    leafNodes: [{
        type: String,
        require: true
    }],
    depth: {
        type: Number,
        require: true,
    },
    root: String,
    innerNodes: [{
        type: [{
            type: String
        }]
    }]
})

module.exports = mongoose.model('Tree', treeSchema);
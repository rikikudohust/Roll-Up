const mongoose = require('mongoose');
const treeSchema = new mongoose.Schema({
    root: {
        require: true,
        type: String
    },
    account: {
        require: true,
        type: Number
    }
})

module.exports = mongoose.model('Tree', treeSchema);
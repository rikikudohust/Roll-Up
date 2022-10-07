const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    fromX: {
        require: true,
        type: String
    },
    fromY: {
        require: true,
        type: String
    },
    fromIndex: {
        require: true,
        type: Number
    },
    toX: {
        require: true,
        type: String
    },
    toY: {
        require: true,
        type: String
    },
    toIndex: {
        require: true,
        type: Number
    },
    nonce: {
        require: true,
        type: Number
    },
    amount: {
        require: true,
        type: Number
    },
    tokenType: {
        require: true,
        type: Number
    },
    hashTx: {
        require: false,
        type: String
    },
    R8x: {
        require: false,
        type: String
    },
    R8y: {
        require: false,
        type: String
    },
    S: {
        require: false,
        type: String
    }
    // block: {
    //     require: false,
    //     type: String
    // }
})

module.exports = mongoose.model('Block', blockSchema);
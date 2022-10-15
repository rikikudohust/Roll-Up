const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    index: {
        require: true,
        type: Number
    },
    pubkeyX: {
        require: true,
        type: String
    },
    pubkeyY: {
        require: true,
        type: String
    },
    balance: {
        require: true,
        type: Number,
    },
    nonce: {
        require: true,
        type: Number
    },
    tokenType: {
        require: true,
        type: Number
    },
    hash: {
        require: true,
        type: String
    },
    l1Address: {
        require: true,
        type: String
    },
    path: {
        require: true,
        type: [Number]
    }
})

module.exports = mongoose.model('Account', accountSchema);
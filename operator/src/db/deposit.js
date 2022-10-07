const mongoose = require('mongoose');
const depositSchema = new mongoose.Schema({
    index: {
        require: true,
        type: Number
    },
    fromX: {
        require: true,
        type: String
    },
    fromY: {
        require: true,
        type: String
    },
    amount: {
        require: true,
        type: Number
    },
    tokenType: {
        require: true,
        type: Number
    }
})

module.exports = mongoose.model('depositPending', depositSchema);
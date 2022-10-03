const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('Account', accountSchema);
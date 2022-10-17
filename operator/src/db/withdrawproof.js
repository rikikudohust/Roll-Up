const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    hashWithdraw: {
        require: true,
        type: String
    },
    txRoot:{
        require:true,
        type:String
    },
    position:{
        require: true,
        type: [Number],
        //default:undefined
    },
    proof:{
        require:true,
        type: [String],
        //default: undefined,
    }
})

module.exports = mongoose.model('WithdrawProof', accountSchema);
const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    hashWithdraw: {
        require: true,
        type: String
    },
    pubkeyX:{
        require:true,
        type:String
    },
    pubkeyY:{
        require:true,
        type:String
    },
    index:{
        require:true,
        type:String
    },
    nonce:
    {
        require:true,
        type:Number
    },
    amount:{
        require:true,
        type:Number
    },
    recipient:{
        require:true,
        type: String
    },
    updateA:{
        require: true,
        type: [String]
    },
    updateB:{
        require: true,
        type: [[String]]
    },
    updateC:{
        require: true,
        type: [String]
    },
})

module.exports = mongoose.model('Withdraw', accountSchema);
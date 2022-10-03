const { buildPoseidon } = require('circomlibjs');
const { stringifyBigInts, unstringifyBigInts } = require('../utils/stringifybigint.js')

module.exports = class Transaction {
    constructor(
        _poseidon,
        _fromX, _fromY, _fromIndex,
        _toX, _toY, _toIndex,
        _nonce, _amount, _tokenType,
        _R8x = null, _R8y = null, _S = null, hash = null
    ) {
        this.fromX = _fromX;
        this.fromY = _fromY;
        this.fromIndex = _fromIndex;
        this.toX = _toX;
        this.toY = _toY;
        this.toIndex = _toIndex;
        this.nonce = _nonce;
        this.amount = _amount
        this.tokenType = _tokenType;

        this.R8x = _R8x;
        this.R8y = _R8y;
        this.S = _S;
        this.hash = hash;
        this.poseidon = _poseidon;
    }

    async hashTx() {
        // hash unsigned transaction in subleaf mode
        const leftSubLeaf = this.poseidon([
            this.fromX.toString(),
            this.fromY.toString(),
            this.toX.toString(),
            this.toY.toString(),
        ]);
        const rightSubLeaf = this.poseidon([
            this.fromIndex.toString(),
            this.nonce.toString(),
            this.amount.toString(),
            this.tokenType.toString()
        ]);
        const txHash = this.poseidon([
            leftSubLeaf,
            rightSubLeaf,
        ]);
        return txHash;
        // return this.poseidon.F.e(1234);
    }

    async inforTx() {
        var data = {
            "fromX": this.fromX,
            "fromY": this.fromY,
            "fromIndex": this.fromIndex,
            "toX": this.toX,
            "toY": this.toY,
            "toIndex": this.toIndex,
            "nonce": this.nonce,
            "amount": this.amount,
            "tokenType": this.tokenType,
            "R8x": this.R8x,
            "R8y": this.R8y,
            "S": this.S
        }
        return data;
    }
}

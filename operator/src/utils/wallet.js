const {buildEddsa, buildBabyjub} = require('circomlibjs');

class Wallet {
    constructor(
        prvKey,
        eddsa,
        babyJub
    ) {
        this.prvKey = prvKey;
        this.eddsa = eddsa;
        this.babyJub = babyJub;
        this.pubKey = eddsa.prv2pub(prvKey); 
    }

    async signMessage(msg) {
        
    }
}

const express = require('express');
const router = express.Router();
const {genereteNewWallet} = require('../services/monitoring/walletService')

router.post('/', async function(req, res, next) {
    try {
        res.status(200).json(await genereteNewWallet());
    } catch (err) {
        console.log('Error POST /wallets/', err);
        return res.status(404).json({message: false});
    }
});

module.exports = router;
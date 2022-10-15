const express = require('express');
const router = express.Router();

const { depositL2, getPendingDeposit, getPendingDepositByAddress } = require('../services/monitoring/depositService')

router.post('/', async function (req, res, next) {
    try {
        var fromX = req.body.fromX;
        var fromY = req.body.fromY;
        var l1Address = req.body.l1Address;
        var amount = req.body.amount;
        var tokenType = req.body.tokenType;
        res.status(200).json(await depositL2(l1Address, fromX, fromY, amount, tokenType));
    } catch (err) {
        console.error("Error deposit/", err);
        return res.status(404).json({ message: false });
    }
});

router.post('/pending/users', async function (req, res, next) {
    try {
        res.status(200).json(await getPendingDeposit());
    } catch (err) {
        console.error("Error /deposit/pending/users", err);
        return res.status(404);
    }
})

router.post('/pending/users/:address', async function (req, res, next) {
    try {
        res.status(200).json(await getPendingDepositByAddress(req.params.address));
    } catch (err) {
        console.error("Error /deposit/pending/users/:address", err);
        return res.status(404);
    }
})

module.exports = router;
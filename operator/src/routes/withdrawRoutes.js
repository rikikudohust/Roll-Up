const express = require('express');
const router = express.Router();

router.post('/', async function (req, res, next) {
    try {
        res.status(200).json(await depositL2(req.body));
    } catch (err) {
        console.error("Error withdraw/", err);
        return res.status(404).json({ message: false });
    }
});

router.post('/pending/users', async function (req, res, next) {
    try {
        res.status(200).json(await getPendingWithdraw());
    } catch (err) {
        console.error("Error /withdraw/pending/users", err);
        return res.status(404);
    }
})

router.post('/pending/users/:address', async function (req, res, next) {
    try {
        res.status(200).json(await getPendingWithdrawByAddress(req.params.address));
    } catch (err) {
        console.error("Error /withdraw/pending/users/:address", err);
        return res.status(404);
    }
})

module.exports = router;
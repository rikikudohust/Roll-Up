const express = require('express');
const router = express.Router();

const {withdrawToL1, getAllWithdrawProof} = require('../services/monitoring/withdrawService');

router.post('/', async function (req, res, next) {
    try {
        res.status(200).json(await withdrawToL1(req.body));
    } catch (err) {
        console.error("Error withdraw/", err);
        next(err);
    }
});

router.get('/users/:address', async function(req, res, next) {
    try {
        res.status(200).json(await getAllWithdrawProof(req.params.address));
    } catch(err) {
        console.error("Error GET /withdraw/users/:address");
        next(err);
    }
});

// router.post('/pending/users', async function (req, res, next) {
//     try {
//         res.status(200).json(await getPendingWithdraw());
//     } catch (err) {
//         console.error("Error /withdraw/pending/users", err);
//         return res.status(404);
//     }
// })

// router.post('/pending/users/:address', async function (req, res, next) {
//     try {
//         res.status(200).json(await getPendingWithdrawByAddress(req.params.address));
//     } catch (err) {
//         console.error("Error /withdraw/pending/users/:address", err);
//         return res.status(404);
//     }
// })

module.exports = router;
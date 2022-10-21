const express = require('express'); 
const router = express.Router();

const { getTransactionDetail, postTransaction,getPendingTransactionByAddress, getTransactionByAddress, getTransactionById, getTransactions, postTestTransaction} = require('../services/monitoring/transactionService');

router.get('/', async function (req, res, next) {
    try {
        res.status(200).json(await getTransactions());
    } catch (err) {
        console.error("Err", err);
        next(err);
    }
});


router.get('/:id', async function (req, res, next) {
    try {
        res.status(200).json(await getTransactionById(req.params.id));
    } catch (err) {
        console.error("Error: ", err);
        next(err);
    }
})

router.get('/users/index/:id', async function (req, res, next) {
    try {
        res.status(200).json(await getTransactionByUserId(req.params.id));
    } catch (err) {
        console.error("Error: ", err);
        next(err);
    }
})

router.get('/users/address/:address', async function (req, res, next) {
    try {
        res.status(200).json(await getTransactionByAddress(req.params.address));
    } catch (err) {
        console.error("Error: ", err);
        next(err);
    }
});

router.get('/users/pending/address/:address', async function (req, res, next) {
    try {
        res.status(200).json(await getPendingTransactionByAddress(req.params.address));
    } catch (err) {
        console.error("Error: ", err);
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        res.status(200).json(await postTransaction(req.body));
    } catch(err) {
        console.error("Error", err);
        next(err);
    }
})

router.post('/detail', async function (req, res, next) {
    try {
        res.status(200).json(await getTransactionDetail(req.body));
    } catch(err) {
        console.error("Error POST /transactions/detail", err);
        next(err);
    }
})

router.post('/test', async function (req, res, next) {
    try {
        res.status(200).json(await postTestTransaction(req.body));
    } catch(err) {
        console.error("Error POST /transactions/test", err);
        next(err);
    }
});
module.exports = router;
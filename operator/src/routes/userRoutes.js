const express = require('express');
const router = express.Router();
const {getAccountByAddress, getAllAccounts, getAccountByIndex} = require('../services/monitoring/userService.js')


router.get('/', async function(req, res, next) {
    try {
        res.status(200).json(await getAllAccounts());
    } catch(err) {
        console.error("Error /users/", err);
        return res.status(404).json({message: false});
    }
});

router.get('/:address', async function(req, res, next) {
    try {
        res.status(200).json(await getAccountByAddress(req.params.address));
    } catch(err) {
        console.error("Error GET /users/:address", err);
        return res.status(404).json({message: false});
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        res.status(200).json(await getAccountByIndex(req.params.id));
    } catch(err) {
        console.error("Error GET /users/:id", err);
        return res.status(404).json({message: false});
    }
});

module.exports = router;

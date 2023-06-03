/**
 * This file manages all routes for the application.
 * It's responsible for connecting URL paths to the appropriate controller functions.
 */

const express = require('express');
const router = express.Router();

const faucetController = require('../controllers/faucetController');
const userController = require('../controllers/userController');

// Faucet related routes
router.post('/createFaucet', faucetController.createFaucet);
router.post('/claimFaucet', faucetController.claimFaucet);
router.get('/getAvailableFaucets', faucetController.getAvailableFaucets);


// User related routes
router.post('/createUser', userController.createUser);
router.get('/getUserDetails/:bananoAddress', userController.getUserDetails);

module.exports = router;

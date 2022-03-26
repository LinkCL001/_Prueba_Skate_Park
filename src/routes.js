const express = require('express');
const router = express.Router();
const skatersController = require('./controllers/skaters');
const loginController = require('./controllers/login');

router.get('/skaters', skatersController.getAll)
router.post('/login', loginController.loginUser)

module.exports = router
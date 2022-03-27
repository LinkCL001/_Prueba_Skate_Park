const express = require('express');
const router = express.Router();
const skatersController = require('./controllers/skaters');
const loginController = require('./controllers/login');

router.get('/skaters', skatersController.getAll)
router.get('/skaters/:id', skatersController.getOne)
router.delete("/skaters/:id", skatersController.deleteOne)

router.post('/login', loginController.loginUser)

module.exports = router
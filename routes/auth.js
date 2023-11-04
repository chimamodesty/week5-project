const router = require('express').Router();
const authServices = require('../controller/auth')


router.get('/google/login', authServices.getGooglAuthURL)
router.get('/google', authServices.getTokens)
router.get('/logout', authServices.logout)

module.exports = router
const routes = require('express').Router();


routes.use('/', require('./swagger.js'))
routes.use('/expenses', require('./expenses'))
routes.use('/auth', require('./auth'))


module.exports = routes;
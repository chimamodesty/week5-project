const routes = require('express').Router();


routes.use('/', require('./swagger.js'))
routes.use('/expenses', require('./expenses'))


module.exports = routes;
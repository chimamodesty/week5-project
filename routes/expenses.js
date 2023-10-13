const router = require('express').Router();

const services = require('../controller/expenses');

router.get('/', services.allExpenses);
router.get('/:id', services.expenseById)

router.post('/', services.addExpense)
router.put('/:id', services.updateExpense)

module.exports = router
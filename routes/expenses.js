const router = require('express').Router();
const {validation, expenseValidationRules, validateID} = require('../controller/validate')

const services = require('../controller/expenses');

router.get('/', services.allExpenses);
router.get('/:id', validateID(), validation, services.expenseById)

router.post('/', expenseValidationRules(), validation, services.addExpense)
router.put('/:id',  validateID(), expenseValidationRules(), validation, services.updateExpense)
router.delete('/:id', validateID(), validation, services.deleteExpense)

module.exports = router;
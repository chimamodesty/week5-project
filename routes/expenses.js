const router = require('express').Router();
const {validation, expenseValidationRules, validateID} = require('../controller/validate')

const services = require('../controller/expenses');
const { requireAuth } = require('../middleware');

router.get('/', requireAuth, services.allExpenses);
router.get('/:id', validateID(), validation, services.expenseById)

router.post('/', requireAuth, expenseValidationRules(), validation, services.addExpense)
router.put('/:id', requireAuth,  validateID(), expenseValidationRules(), validation, services.updateExpense)
router.delete('/:id', requireAuth, validateID(), validation, services.deleteExpense)


module.exports = router;
const {check, param, validationResult} = require('express-validator')
const ObjectId = require('mongodb').ObjectId

const expenseValidationRules = () => {
  return [ 
    check('category','Must be any of the stated category - Food, Transportation, Entertainment, Bills or Other').custom(val => {
        const category_list = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other']
        return category_list.includes(val)
    }),
    check('amount', 'Must be a float eg 4.99').isFloat(),
    check('expense_date', 'Should be in YYYY-MM-DD format').isDate(),
  ]
}

const validateID = () => {
    return check('id', 'Must be a valid mongodb objectID').customSanitizer(value => ObjectId(value))
}

const validation = (req, res, next) => {
    const errs = validationResult(req)
    // console.log(errs)
    if (!errs.isEmpty()){
        let mappedErrs = []
    errs.array().map( err => mappedErrs.push({ [err.path]: err.msg}))
    // res.status(422).json({'errors':mappedErrs})
    throw new ValidationError('The data submitted is not valid', mappedErrs);
    }

    next()
   
}

class ValidationError extends Error {
    constructor(message, validationErrors) {
      super(message);
      this.validationErrors = validationErrors;
      this.name = 'ValidationError'
    }
  }


module.exports = {
    expenseValidationRules,
    validation,
    validateID,
    ValidationError
}

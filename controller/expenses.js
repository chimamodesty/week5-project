const mongodb = require('../db/connect')
const { validation } = require('./validate')

const ObjectId = require('mongodb').ObjectId

// const dbCollection = mongodb.getDb().db().collection('expenses')

// const isIncluded = (val) => {
//     const category_list = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other']
    
//     const avail = (category_list.includes(val)) ? true : false
//     return avail
// }

const allExpenses = async (req, res, next)=> {
    try {
        const result = await mongodb.getDb().db().collection('expenses').find({})
        result.toArray().then(lists => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(lists)
    })
    } catch (error) {
        next(error)
    }
    
}

const expenseById = async (req, res, next) => {
    const id = req.params.id

    try {
        const result = await mongodb.getDb().db().collection('expenses').findOne({'_id': new ObjectId(id)})
        if (!result)
            throw new Error('Expense does not exist in Database')

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(result)
    } catch (error) {   
        next(error)
    }
    
    
}

const addExpense = async  (req, res, next) => {
    const {category, description, amount, expense_date} = req.body

    
    
      const data = {
            category,
            description,
            amount,
            expense_date
        }
    
        await mongodb.getDb().db().collection('expenses').insertOne(data)
            .then(result => {
                res.status(201).json({"message": "created successfully",
                "insertedId": result.insertedId})
            }).catch(err => res.status(400).send({"error": err.message}))
      
}


const updateExpense = async (req, res, next) => {
    const userId = new ObjectId(req.params.id)
    await mongodb.getDb().db().collection('expenses').updateOne(
        {'_id': userId},
        {$set: {...req.body}} 
        )
        .then(result => 
            res.status(204).json(result))
        .catch(err => res.status(400).json({'error': err.message}))
}

const deleteExpense = async (req, res, next) => {
    const userId = new ObjectId(req.params.id)

    await mongodb.getDb().db().collection('expenses').deleteOne({'_id': userId})
        .then(result => res.status(200).json({"deletedId": req.params.id, ...result}))
        .catch(err => next(err))
        
}

module.exports = {
    allExpenses,
    expenseById,
    addExpense,
    updateExpense,
    deleteExpense
}
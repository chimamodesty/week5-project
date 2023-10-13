const mongodb = require('../db/connect')

const ObjectId = require('mongodb').ObjectId

// const dbCollection = mongodb.getDb().db().collection('expenses')

const isIncluded = (val) => {
    const category_list = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other']
    
    const avail = (category_list.includes(val)) ? true : false
    return avail
}

const allExpenses = async (req, res, next) => {
    const result = await mongodb.getDb().db().collection('expenses').find({})
    result.toArray().then(lists => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(lists)
    })
}

const expenseById = async (req, res, next) => {
    const id = req.params.id

    const result = await mongodb.getDb().db().collection('expenses').findOne({'_id': new ObjectId(id)})
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(result)
    
}

const addExpense = async (req, res, next) => {
    const {category, description, amount, expense_date} = req.body

    inCatList = isIncluded(category)
    if (inCatList) {
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
    } else {
        res.status(400).send({"error": `${category} is not among the list of available categories`})
    }
    
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

module.exports = {
    allExpenses,
    expenseById,
    addExpense,
    updateExpense
}
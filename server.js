const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
const { ValidationError } = require('./controller/validate')

const mongodb = require('./db/connect')

const port = process.env.port || 8000


app
    .use(bodyParser.json())
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin','*')
        next()
    })
    .use('/', require('./routes'))
    .use((req, res, next) => {
        // handle 404 error
        const error = new Error('Not Found')
        error.status = 404
        next(error)
    })
    .use((err, req, res, next) => {
        // Validation error
        if(err instanceof ValidationError ) {
            return res.status(400)
            .json({
                "message": err.message,
                "error": err.validationErrors
            })
        }
        // Handle any other error
        res.status(err.status || 500)
        res.send({
            error: {
                status: err.status || 500,
                message: err.message
            }
        })
    })


mongodb.initDB((err, mongodb) => {
    if (err) {
        console.log(err)
    } else {
        app.listen(port)
        console.log(`DB connected and server is running on port ${port}`);
        
    }

})
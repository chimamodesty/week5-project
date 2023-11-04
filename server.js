const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

const mongodb = require('./db/connect')

// Middleware imports
const { errorValidations, notFound, requireAuth } = require('./middleware')

const port = process.env.port || 8000


app
    .use(bodyParser.json())
    .use(cors())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin','*')
        next()
    })
    .use('/', require('./routes'))
    .use(notFound)
    .use(requireAuth)
    .use(errorValidations)


mongodb.initDB((err, mongodb) => {
    if (err) {
        console.log(err)
    } else {
        app.listen(port)
        console.log(`DB connected and server is running on port ${port}`);
        
    }

})
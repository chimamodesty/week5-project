const jwt = require('jsonwebtoken')
const { ValidationError } = require('../controller/validate')
const { oauthClient } = require('../controller/auth')

const errorValidations = (err, req, res, next) => {
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
}

const notFound = (req, res, next) => {
    // handle 404 error
    const error = new Error('Not Found')
    error.status = 404
    next(error)
} 

const requireAuth = async (req, res, next) => {

    const token = req.cookies.token
    
    // Redirect user if token does not exist
    if (!token) {
        
      //  res.redirect('/auth/google/login')
      err = new Error('protected route, please login')
            err.status = 401
            next(err)
    }
    
    // decode and verify the token if it exist
    try {
        const decoded = jwt.decode(token, { complete: true })
        
        if (!decoded) {
            const error = new Error('Not authenticated')
            error.status = 401
            next(error)
        }

        
        // let verifyDecoded = jwt.verify(token, decoded.header.kid, {algorithms: ['RS256', 'RS384', 'RS512']})
        const verifyAuth = await oauthClient.verifyIdToken({idToken: token, audience: process.env.CLIENT_ID})
        // console.log(verifyAuth)
        if (!verifyAuth) {
            
            err = new Error('Invalid Auth key')
            err.status = 401
            next(err)
        }
   
    } catch (error) {
        
        next(error)
    }
    next()
}

module.exports = {
    notFound,
    requireAuth,
    errorValidations
}
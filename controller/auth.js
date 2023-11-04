// const querystring = require('querystring')
const jwt = require('jsonwebtoken')
const { google } = require('googleapis')

//const cred = require('../credentials.json')
const redirectURI = 'auth/google'
// Google OAuth url link


const oauthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const SCOPES =  [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
]

/*
const getGoogleOAuthURL = () => {
    const rootUrl = cred.web.auth_uri
    console.log(rootUrl)
    const options = {
        redirect_uri: `${cred.web.javascript_origins[0]}/${ redirectURI }`,
        client_id: cred.web.client_id,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    }

    url = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })

    // return `${rootUrl}?${querystring.stringify(options)}`
    return url
}
*/

const getGooglAuthURL = (req, res, next) => {
    
    const url = oauthClient.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            })
    res.redirect(301, url)
}

const getTokens = async (req, res, next) => {
    const code = req.query.code
    const gtokens = await oauthClient.getToken(code)
    const { id_token } = gtokens.tokens
    oauthClient.setCredentials(gtokens)

    // console.log(id_token)
    res.cookie('token', id_token, {httpOnly: true})
    const user = jwt.decode(id_token, { complete: true })

    
    
    res.json({'message': 'Successfully logged-in', 'email': user.payload.email, 'name': user.payload.name })
    // res.send(`${ req.protocol }://${ req.get('host') }${ req.originalUrl } - ${code}`)
}

const logout = async (req, res, next) => {
    
    res.clearCookie('token').send('Successfully cleared auth keys')
}


module.exports = {
    getGooglAuthURL,
    getTokens,
    logout,
    oauthClient
}


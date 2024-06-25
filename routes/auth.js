
const router = new Router()
const ExpressError = require('../expressError')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const Router = require('express').Router
const User = requite('../models/user')

router.get('/', (req,res,next) => {
    res.send('App is working')
})

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async function (req, res, next) {
    try {
        let {username, password} = req.body
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json({token})
        } else {
            throw new ExpressError('Invalid login credentials', 400)
            }
    } catch(e) {
        return next(e)
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function (req, res, next) {
    try {
        let {username} = await User.regist(req.body)
        let token = jwt.sign({username}, SECRET_KEY)
        User.updateLoginTimestamp(username)
        return res.json({token})
    } catch(e) {
        return next(e)
    }
})
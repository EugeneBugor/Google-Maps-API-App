const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('./lib/mongoose'),
    user = require('./models/user'),
    config = require('./config/index'),
    jwt = require('jsonwebtoken')

const app = express()
const AuthError = user.AuthError
const User = user.User

app.set('port', config.get('port'))
app.set('superSecret', config.get('secret'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-cache')
    next()
});

(function initWebpack() {
    const webpack = require('webpack')
    const webpackConfig = require('./webpack.config.js')
    const compiler = webpack(webpackConfig)

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.path
    }))

    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }))

    app.use(express.static(__dirname + '/public'))
})()

app.post('/auth', function (req, res, next) {
    const username = req.body.username
    const password = req.body.password

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError && err.message == 'Wrong password.') {
                res.json({
                    success: false,
                    message: 'Wrong password.'
                })
            } else {
                return next(err)
            }
        } else {
            const token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 86400
            })
            res.json({
                success: true,
                message: 'Enjoy your token!',
                userData: {
                    username: user.username,
                    markers: user.markers
                },
                token: token
            })
        }
    })
})

app.get('/user', function (req, res, next) {
    const token = req.headers['x-access-token']
    let result = ''
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                User.findOne({username: decoded._doc.username}, (err, user) => {
                    if (err) {
                        next(err)
                    }
                    if (user) {
                        {
                            result = res.status(200).json({
                                success: true,
                                userData: {
                                    username: decoded._doc.username,
                                    markers: user.markers
                                },
                                message: 'Succeed to authenticate token.'
                            })
                        }
                    } else {
                        result = res.status(403).json({
                            success: false,
                            message: 'Faild to authenticate user.'
                        })
                    }
                })
                return result
            }
        })
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
})

app.post('/map', function (req, res, next) {
    const username = req.body.username
    const markers = req.body.markers

    User.update(username, markers, function (err) {
        if (err) return next(err)
        res.json({
            markers: markers
        })
    })
})

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(app.get('port'), (error) => {
    if (error) {
        console.error(error)
    } else {
        console.info('Server started: http://localhost:' + app.get('port') + '/')
    }
})

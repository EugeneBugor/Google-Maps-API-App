import crypto from 'crypto'
import util from 'util';

const mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    markers: {
        type: Array,
        required: false
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function (username, password, callback) {
    const User = this;

    new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err) reject(err);
            resolve(user);
        })
    })
        .then((user) => {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError('Wrong password.'), null);
                }
            } else {
                const user = new User({
                    username: username,
                    password: password,
                    markers: []
                });
                user.save(function (err) {
                    if (err) callback(err);
                });
                callback(null, user);

                //callback(new AuthError('No such user.'), null);
            }
        })
        .catch(err => {
            callback(err, null);
        })
};

schema.statics.update = function (username, markers, callback) {
    const User = this;

    new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err) reject(err);
            resolve(user);
        })
    })
        .then((user) => {
            if (user) {
                user.markers = markers;
                user.save();
                callback(null, user);
            } else {
                callback(new AuthError('No such user.'), null);
            }
        })
        .catch(err => {
            callback(err, null);
        })
}

export const User = mongoose.model('User', schema);

export function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

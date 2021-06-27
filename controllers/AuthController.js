const User = require('../model/user')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const Common = require('../util/common')


exports.getLogin = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
        oldInputData: { empNo: '', password: '' },
        validationErrors: []
    });
}

exports.postLogin = (req, res, next) => {
    const password = req.body.password
    const empNo = req.body.empNo
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInputData: { empNo: empNo, password: password },
            validationErrors: errors.array()
        });
    }
    User.findOne({ where: { empNo: empNo } })
        .then(user => {
            if (!user) {
                req.flash('error', 'User does not exist. Please contact your administrator!');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(isPasswordMatching => {
                    if (!isPasswordMatching) {
                        req.flash('error', 'Invalid Employee Number or password.');
                        return res.redirect('/login');
                    }
                    req.session.isLoggedIn = true
                    req.session.user = user
                    req.session.save((err) => {
                        console.log(err)
                        res.redirect('/')
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.isLoggedIn = false
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getChangePassword = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    res.render('auth/change-password', {
        pageTitle: 'Change Password',
        path: '/change-password',
        errorMessage: message,
        oldInputData: { empNo: '', newPassword: '', oldPassword: '', confirmPassword: '' }
    });
}

exports.postChangePassword = (req, res, next) => {
    let resetUser;
    const newPassword = req.body.newPass
    const confirmPassword = req.body.confirmPass
    const oldPassword = req.body.oldPass
    const empNo = req.body.empNo
    const errors = validationResult(req)
    console.log('errors in post ', errors)
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/change-password', {
            path: '/change-password',
            pageTitle: 'Change Password',
            errorMessage: errors.array()[0].msg,
            oldInputData: { empNo: empNo, newPassword: newPassword, oldPassword: oldPassword, confirmPassword: confirmPassword }
        });
    }
    User.findOne({ where: { empNo: empNo } })
        .then(user => {
            // This check is handled in the Validation
            // if (!user) {
            //     req.flash('error', 'Employee does not exist. Please contact your admin!');
            //     return res.redirect('/login');
            // }
            resetUser = user
            bcrypt.hash(newPassword, 12)
                .then(hashedPass => {
                    resetUser.password = hashedPass
                    return resetUser.save()
                })
                .then(result => {
                    console.log('Passowrd Changed Succesfully')
                    res.redirect('/login');
                })
                .catch(err => console.log(err))
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

// Not using this route for now
exports.getResetPassword = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    res.render('auth/change-password', {
        pageTitle: 'Change Password',
        path: '/change-password',
        errorMessage: message
    });
}

// Not using this route for now
exports.postResetPassword = (req, res, next) => {
    User.findOne({ where: { empNo: req.body.empNo } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Employee does not exist. Please contact your admin!');
                return res.redirect('/login');
            }
            res.redirect('/change-password')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}


// Setting the key/value pairs needed globally across all the pages
// 1. It can be stored in the global variables -- this will be shared by all the users
// 2. We can store it in the cookies, this will store the data on the client side -- Con's : it can be easily editable from the browser. 
// 3. Session: If we store in session it would be maintained per user and bit more secure than cookies.
//      Session can be stored via memory or it can be stored in the database as well


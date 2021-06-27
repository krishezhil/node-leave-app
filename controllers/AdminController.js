const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

const LeaveType = require('../model/leave-type');
const User = require('../model/user');
const Common = require('../util/common')
const USER_ACTIVE = 1

exports.getAddLeaveType = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    res.render('admin/add-leave-type', {
        pageTitle: 'Add Leave Type',
        path: '/admin/add-leave-type',
        formCss: true,
        leaveCss: true,
        activeAddLeave: true,
        errorMessage: message
    });
}

exports.postAddLeaveType = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-leave-type', {
            pageTitle: 'Add Leave Type',
            path: '/admin/add-leave-type',
            activeAddLeave: true,
            errorMessage: errors.array()[0].msg
        });
    }
    LeaveType.create({
        leaveType: req.body.leaveType,
        leaveDesc: req.body.leaveTypeDesc
    })
        .then(result => {
            res.redirect('/admin/leave-types')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}


exports.getLeaveTypes = (req, res, next) => {
    LeaveType.findAll()
        .then(result => {
            res.render('admin/leave-types', {
                prods: result,
                pageTitle: 'Leave Type',
                path: '/admin/leave-types',
                activeLeaveType: true,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}


exports.getAddEmployee = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    res.render('admin/add-emp', {
        pageTitle: 'Add an Employee',
        path: '/admin/add-emp',
        activeAddEmp: true,
        errorMessage: message,
        oldInputData: { empNo: '', password: '', name: '', lastName: '', email: '', dateOfJoin: '' }
    });
}

exports.postAddEmployee = (req, res, next) => {
    const empNo = req.body.empNo
    const password = req.body.password
    const name = req.body.name
    const lastName = req.body.lastName
    const email = req.body.email
    const dateOfJoin = req.body.doj
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-emp', {
            path: '/add-emp',
            pageTitle: 'Add Employee',
            errorMessage: errors.array()[0].msg,
            oldInputData: { empNo: empNo, password: password, name: name, lastName: lastName, email: email, dateOfJoin: dateOfJoin }
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            User.create({
                empNo: empNo,
                password: hashedPass,
                name: name,
                lastName: lastName,
                email: email,
                dateOfJoin: dateOfJoin,
                UserStatusId: USER_ACTIVE
                // When a new user is created making the user as active
            }).then(result => {
                console.log('User Created !')
                res.redirect('/')
            }).catch(err => console.log('Error Occured', err))

        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    // TODO: we shall pull the password 
}
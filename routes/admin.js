const express = require('express')
const adminController = require('../controllers/AdminController')
const isAuthenticated = require('../middleware/is-auth')
const { check, body } = require('express-validator')
const User = require('../model/user')

const router = express.Router()

// since the code executes line by line it tries to resolve the /users first before the /
router.get('/add-leave-type', isAuthenticated, adminController.getAddLeaveType)

router.post('/add-leave-type',
    [
        check('leaveType', 'Leave Type is required').not().isEmpty(),
        check('leaveTypeDesc', 'Leave Type Descrption is required').not().isEmpty(),
    ],
    isAuthenticated, adminController.postAddLeaveType)

router.get('/leave-types', isAuthenticated, adminController.getLeaveTypes)

router.get('/add-emp', isAuthenticated, adminController.getAddEmployee)

router.post('/add-emp',
    [
        check('empNo', 'Employee number is required').not().isEmpty(),
        body('empNo').custom((value, { req }) => {
            return User.findOne({ where: { empNo: value } })
                .then(user => {
                    if (user) {
                        return Promise.reject('Employee already added. Please pick different one.')
                    }
                })
        }),
        check('password', 'Password is required').not().isEmpty(),
        check('password', 'Please enter a password with only numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
        ,
        check('name', 'Employee name is required').not().isEmpty(),
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Please enter valid email').isEmail(),
        check('email').custom((value, { req }) => {
            return User.findOne({ where: { email: value } })
                .then(user => {
                    if (user) {
                        return Promise.reject(
                            'E-Mail used already, please pick a different one.'
                        );
                    }
                })
        }),
        check('doj', 'Date Of Join is required').not().isEmpty()
    ], isAuthenticated, adminController.postAddEmployee)

//module.exports = router
module.exports = router


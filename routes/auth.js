const express = require('express')
const authController = require('../controllers/AuthController')
const User = require('../model/user')
const { check, body } = require('express-validator');


const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login',
    [
        check('empNo', 'Employee number is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/change-password', authController.getChangePassword)

router.post('/change-password',
    [
        check('empNo', 'Employee number is required').not().isEmpty(),
        body('empNo').custom((value, { req }) => {
            return User.findOne({ where: { empNo: value } })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Employee does not exist. Please pick a different one.')
                    }
                })
        }),
        check('oldPass', 'Old Password is required').not().isEmpty(),
        check('newPass', 'New Password is required').not().isEmpty(),
        check('confirmPass', 'Confirm Password is required').not().isEmpty(),
        body('newPass', 'Please enter a password with only numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPass').custom((value, { req }) => {
            if (req.body.newPass !== value) {
                throw new Error('Passwords have to match!')
            }
            return true;
        }
        )
    ],
    authController.postChangePassword)

router.get('/reset-password', authController.getResetPassword) // not using this route for now. we need to add this to admin

router.post('/reset-password', authController.postResetPassword) // not using this route for now. we need to add this to admin


module.exports = router

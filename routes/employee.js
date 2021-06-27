const express = require('express')
const { check, body } = require('express-validator')
const empLeaveController = require('../controllers/EmpLeaveController')
const isAuthenticated = require('../middleware/is-auth')

const router = express.Router()

// In some scenarios the order of the router configuration matters
// As the code executes line by line it tries to resolve the /users first before the /


// router.get('/leave-balances', empLeaveController.getLeaveBalances)

router.get('/leave-requests', isAuthenticated, empLeaveController.getLeaveRequests)

router.get('/create-leave', isAuthenticated, empLeaveController.getCreateLeave)

router.post('/add-leave', [
    check('fromDate', 'From date is required').not().isEmpty(),
    check('toDate', 'To date is required').not().isEmpty(),
    check('reason', 'Reason is required').not().isEmpty(),
], isAuthenticated, empLeaveController.postCreateLeave)

router.get('/leave-detail/:leaveId', isAuthenticated, empLeaveController.getEditLeave)

router.post('/edit-leave',
    [
        check('fromDate', 'From date is required').not().isEmpty(),
        check('toDate', 'To date is required').not().isEmpty(),
        check('reason', 'Reason is required').not().isEmpty(),
    ], isAuthenticated, empLeaveController.postEditLeave)

router.get('/delete-leave/:leaveId', isAuthenticated, empLeaveController.deleteLeaveRequest) //TODO: Need to change this to post request


//module.exports = router
module.exports = router


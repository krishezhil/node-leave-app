const LeaveType = require('../model/leave-type')
const LeaveRequest = require('../model/leave-request')
const dateformat = require('dateformat')
const { validationResult } = require('express-validator')
const Common = require('../util/common')

exports.getCreateLeave = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    let leaveTypes = req.leaveTypes
    res.render('employee/create-leave', {
        pageTitle: 'Create Leave',
        path: '/emp/create-leave',
        editMode: false,
        leaveTypes: leaveTypes,
        errorMessage: message,
        hasError: false
    });
}

exports.postCreateLeave = (req, res, next) => {
    const errors = validationResult(req)
    let reqBody = req.body // Get Leave Details from Form
    const leaveReqId = reqBody.id
    const fromDate = dateformat(reqBody.fromDate, 'yyyy-mm-dd')
    const toDate = dateformat(reqBody.toDate, 'yyyy-mm-dd')
    let leaveTypes = req.leaveTypes
    let leaveTypeId = reqBody.selectLeaveType
    const selectedLeaveType = leaveTypes.filter(lt => lt.id.toString() === leaveTypeId.toString())[0].leaveType
    const updatedReason = reqBody.reason

    if (!errors.isEmpty()) {
        return res.status(422).render('employee/create-leave', {
            path: '/emp/create-leave',
            pageTitle: 'Create Leave',
            errorMessage: errors.array()[0].msg,
            leaveTypes: leaveTypes,
            editMode: false,
            leaveTypeSelected: selectedLeaveType,
            leaveReq: { id: leaveReqId, fromDateSelected: fromDate, toDateSelected: toDate, reason: updatedReason, leaveTypeId: leaveTypeId },
            hasError: true
        });
    }

    let noOfDays = Common.calculateDays(reqBody.fromDate, reqBody.toDate) //Get the number of days
    let leaveRequestStatusId = 1 // 1- OPEN 
    LeaveType.findByPk(leaveTypeId)
        .then(result => {
            leaveTypeId = result.id
            return req.user.createLeaveRequest({
                fromDate: fromDate,
                toDate: toDate,
                noOfDays: noOfDays,
                isHalfDay: false,
                reason: updatedReason,
                LeaveTypeId: leaveTypeId,
                LeaveRequestStatusId: leaveRequestStatusId,
                supervisor: 'admin'
            })
        })
        .then(result => {
            res.redirect('/employee/leave-requests')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

exports.getEditLeave = (req, res, next) => {
    let message = Common.retrieveErrorMessage(req)
    const leaveTypes = req.leaveTypes
    LeaveRequest.findByPk(req.params.leaveId)
        .then(result => {
            const selectedLeaveType = leaveTypes.filter(lt => lt.id === result.LeaveTypeId)[0].leaveType
            result.fromDateSelected = dateformat(result.fromDate, 'yyyy-mm-dd')
            result.toDateSelected = dateformat(result.toDate, 'yyyy-mm-dd')
            res.render('employee/create-leave', {
                pageTitle: 'Leave Detai',
                path: '/emp/create-leave',
                editMode: true,
                leaveReq: result,
                leaveTypeSelected: selectedLeaveType,
                leaveTypes: leaveTypes,
                errorMessage: message,
                hasError: false
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditLeave = (req, res, next) => {
    // Get Leave Details from Form
    let reqBody = req.body
    const leaveReqId = reqBody.id
    const updatedReason = reqBody.reason
    const updatedLeaveTypeId = reqBody.selectLeaveType
    const errors = validationResult(req)
    let fromDate, toDate
    let leaveTypes = req.leaveTypes
    let selectedLeaveType
    try {
        fromDate = dateformat(reqBody.fromDate, 'yyyy-mm-dd')
        toDate = dateformat(reqBody.toDate, 'yyyy-mm-dd')
        selectedLeaveType = leaveTypes.filter(lt => lt.id.toString() === updatedLeaveTypeId.toString())[0].leaveType
    } catch (error) {
        throw new Error(error)
    }
    if (!errors.isEmpty()) {
        return res.status(422).render('employee/create-leave', {
            path: '/emp/create-leave',
            pageTitle: 'Eidt Leave',
            errorMessage: errors.array()[0].msg,
            leaveTypes: leaveTypes,
            leaveTypeSelected: selectedLeaveType,
            leaveReq: { id: leaveReqId, fromDate: fromDateSelected, toDate: toDateSelected, reason: updatedReason, leaveTypeId: updatedLeaveTypeId },
            editMode: true,
            hasError: true
        });
    }
    LeaveRequest.findByPk(reqBody.id)
        .then(lr => {
            lr.fromDate = fromDate
            lr.toDate = toDate
            lr.LeaveTypeId = updatedLeaveTypeId
            lr.reason = updatedReason
            return lr.save()
        })
        .then(result => {
            console.log('LeaveRequest Updated ')
            res.redirect('/employee/leave-requests')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteLeaveRequest = (req, res, next) => {
    // Get Leave Details from Form
    let leaveId = req.params.leaveId
    LeaveRequest.findByPk(leaveId)
        .then(lr => {
            return lr.destroy() // For now deleting the leave, we can also change this to soft delete
        })
        .then(result => {
            console.log("Leave Request Deleted!!")
            res.redirect('/employee/leave-requests')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getLeaveRequests = (req, res, next) => {
    req.user.getLeaveRequests()
        .then(result => {
            res.render('employee/leave-requests', {
                pageTitle: 'Leave Requests',
                path: '/emp/leave-requests',
                prods: result,
                leaveTypes: req.leaveTypes,
                leaveReqStatus: req.leaveReqStatus,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}
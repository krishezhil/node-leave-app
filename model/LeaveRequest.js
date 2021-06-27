// const leaveRequests = []
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '..', 'data', 'LeaveRequests.json')
const getAllLeaveRequestFromFile = (callback) => {
    fs.readFile(filePath, 'UTF-8', (err, fileData) => {
        if (!err) {
            callback(JSON.parse(fileData))
        } else {
            callback([])
        }
    })
}

module.exports = class LeaveRequest {
    constructor(id, title, details, fromDate, toDate) {
        this.id = id
        this.title = title
        this.details = details
        this.fromDate = fromDate
        this.toDate = toDate
    }

    save() {
        console.log('inside save method', this)
        getAllLeaveRequestFromFile(leaveRequestsList => {
            if (this.id) { // Edit Leave Request.
                console.log('editing the leave request')
                const updatedLeaveReqIndex = leaveRequestsList.findIndex(leaveReq => leaveReq.id === this.id)
                console.log(updatedLeaveReqIndex)
                const updatedLeaveReq = [...leaveRequestsList]
                updatedLeaveReq[updatedLeaveReqIndex] = this // The current object will be updated in the respective index of the leave
                fs.writeFile(filePath, JSON.stringify(updatedLeaveReq), (err) => {
                    console.log(err)
                })
            } else {
                console.log('adding the leave request')
                this.id = Math.random().toString()
                leaveRequestsList.push(this)
                fs.writeFile(filePath, JSON.stringify(leaveRequestsList), (err) => {
                    console.log(err)
                })
            }
        })
    }

    static fetchAll(cb) {
        getAllLeaveRequestFromFile(cb)
    }

    static findById(leaveId, cb) {
        console.log('leave id ', leaveId)
        getAllLeaveRequestFromFile(leaveRequests => {
            const leaveReqeustDetail = leaveRequests.find(leaveReq => leaveReq.id === leaveId)
            console.log('after fetch', leaveReqeustDetail)
            cb(leaveReqeustDetail)
        })
    }

    static deleteById(leaveId) {
        console.log(leaveId)
        getAllLeaveRequestFromFile(leaveReqs => {
            // Find the leave request to delete
            const leaveReqToDelete = leaveReqs.find(leaveReq => leaveReq.id === leaveId)
            // Filter the deltedLeaveReq from the available leaveRequests
            const filteredLeaveReqs = leaveReqs.filter(leaveReq => leaveReq.id !== leaveReqToDelete.id)
            // Write to File
            fs.writeFile(filePath, JSON.stringify(filteredLeaveReqs), (err) => {
                console.log(err)
            })

        })
    }
}
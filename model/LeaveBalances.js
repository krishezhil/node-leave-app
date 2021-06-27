const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '..', 'data', 'LeaveBalances.json')
const getAllBalancesFromFile = (callback) => {

    fs.readFile(filePath, 'UTF-8', (err, fileData) => {
        if (!err) {
            callback(JSON.parse(fileData))
        } else {
            callback([])
        }
    })
}
module.exports = class LeaveBalances {
    constructor() {

    }
    static fetchAll(cb) {
        getAllBalancesFromFile(cb)
    }
}
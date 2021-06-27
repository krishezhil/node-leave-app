exports.retrieveErrorMessage = (req => {
    let message = req.flash('error');
    if (message.length > 0) {
        return message = message[0];
    } else {
        return message = null;
    }
})

exports.calculateDays = ((date1, date2) => {
    let dt1 = new Date(date1)
    let dt2 = new Date(date2)
    const diffTime = Math.abs(dt2 - dt1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
})
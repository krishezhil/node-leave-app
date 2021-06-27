const User = require('../model/user')
const bcrypt = require('bcryptjs')

exports.getHome = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    res.render('dashboard', {
        pageTitle: 'Dashboard',
        path: '/',
        activeDashboard: true
    });
}


// Setting the key/value pairs needed globally across all the pages
// 1. It can be stored in the global variables -- this will be shared by all the users
// 2. We can store it in the cookies, this will store the data on the client side -- Con's : it can be easily editable from the browser. 
// 3. Session: If we store in session it would be maintained per user and bit more secure than cookies.
//      Session can be stored via memory or it can be stored in the database as well


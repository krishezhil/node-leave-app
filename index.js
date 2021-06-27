const express = require('express')
const path = require('path') // This path will also be usefull resolve the path on any operating system
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const session = require('express-session');
const csrf = require('csurf')
const flash = require('connect-flash')
// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store)

const homeRoute = require('./routes/home')
const authRoute = require('./routes/auth')
const adminRoute = require('./routes/admin')
const empRoute = require('./routes/employee')

const errorRoute = require('./controllers/ErrorHandlingController')

const User = require('./model/user')
const UserStatus = require('./model/user-status')
const LeaveRequestStatus = require('./model/leave-request-status')
const LeaveMaster = require('./model/leave-master')
const LeaveRequest = require('./model/leave-request')
const LeaveType = require('./model/leave-type')

const app = express()
const csrfProtection = csrf()
const flashMessage = flash()

app.set('view engine', 'ejs') // assign the hbs view engine
app.set('views', 'views') // app.set() // Global variable for views .

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))


// This middleware is used to set the session in memory by default. We can also configure the store which can be stored in the database
app.use(
    session({
        secret: 'my secret',
        store: new SequelizeStore({
            db: sequelize,
        }),
        resave: false,
        saveUninitialized: false
    })
);

app.use(csrfProtection) // Calling to the csrf middleware for the CSRF protection. It is also importat that where we place this line of code. It has to be places after the session and cookieParser.
app.use(flashMessage)

// This middleware is needed to assign the User model (Sequelize) in the session. Also though we set in the req.user it
// mentioned that this will be maintained for that req user session.
app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findByPk(req.session.user.id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// This route get the list of all leave types and display it in the needed screens
app.use((req, res, next) => {
    LeaveType.findAll()
        .then(leaveTypes => {
            req.leaveTypes = leaveTypes
            next()
        })
        .catch(err => console.log(err))
});

// This route get the list of all leave request statis and display it in the needed screens
app.use((req, res, next) => {
    LeaveRequestStatus.findAll()
        .then(leaveReqStatus => {
            req.leaveReqStatus = leaveReqStatus
            next()
        })
        .catch(err => console.log(err))
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use('/admin', adminRoute)
app.use('/employee', empRoute)
app.use(authRoute)
app.use(homeRoute)
app.use(errorRoute.get404)

app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });

})

// Table relations
tableRelationDefinitions()

// Synch the Tables

// .sync({ force: true })
sequelize
    .sync()
    .then(result => {
        app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })

function tableRelationDefinitions() {
    // Define the Relations of the Table
    UserStatus.hasOne(User)
    User.belongsTo(UserStatus)

    // The below relation is user userId and managerId relation
    User.hasMany(User, { as: 'subordinate' })
    User.belongsTo(User, { as: 'manager' })

    User.hasOne(LeaveMaster)
    LeaveMaster.belongsTo(User)

    LeaveType.hasOne(LeaveMaster)
    LeaveMaster.belongsTo(LeaveType)

    User.hasMany(LeaveRequest)
    LeaveRequest.belongsTo(User)

    LeaveType.hasOne(LeaveRequest)
    LeaveRequest.belongsTo(LeaveType)

    LeaveRequestStatus.hasOne(LeaveRequest)
    LeaveRequest.belongsTo(LeaveRequestStatus)
}
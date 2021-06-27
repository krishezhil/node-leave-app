# node-leave-app
##A Leave Application
>This is a leave application created on node with express-js which also renders html page using ejs view engine. I have just added only employee leave flow. Manager and few other admin flows needs to be created

# How to run the project ?

1. To install dependencies : npm install
2. Run the server : npm start


# API's available
* Admin
  *   /add-emp : To add an emploee
  *   /add-emp : To modify an employee with post method 
  *   /add-leave-type: Add a new leave type
  *   add-leave-type : Modify the existing leave type with post method
* Auth
  *   /login
  *   /logout
  *   /change-password  
* Employee
  *   /leave-requests 
  *   /create-leave
  *   /leave-detail/:leaveId
  *   /edit-leave
  *   /delete-leave/:leaveId
* Manager
  *   TODO


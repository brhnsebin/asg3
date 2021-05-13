const User = require("../models/user");

exports.getUsers = (req, res, next) => {
    // Check if the user is logged in by checking the session     
    // isLoggedIn variable to be true
    // If the user is logged in
    //     Get all users stored in the database using find() method.
    //     Render users-list view and pass the users, pageTitle,
    //     isAuth and user properties to the view
    //     - users: the users your fetch from the database
    //     - isAuth: the session isLoggedin variable value
    //     - pageTitle:  string with a name of the page title
    //     - use: the user information stored in the session
    // Else redirect the user to the login page
    if(req.session.isLoggedIn = true){    
    User.find().then(users => {
        res.render('users-list', {
            users,            
            pageTitle: 'User List',
            isAuth: true,
            use: req.session.body
        })      
        
    }).catch(
        err => console.log(err));
}else{res.redirect('/login')}};


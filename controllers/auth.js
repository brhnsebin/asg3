// 1. import and require needed files
const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getLogin = (req, res, next) => {
    // Render the auth/login view
    // pass the pageTitle, loginClass values to the view
    res.render('auth/login', {
            loginClass: 'active',
            pageTitle: 'User Login'            
        })
};

exports.getSignup = (req, res, next) => {
    // Render the auth/signup view
    // pass the pageTitle, signupClass values to the view
    res.render('auth/signup', {
        pageTitle: 'Signup',
        signupClass: 'active'
    })

};


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(user => {

        if (!user) {
            //will be stored in the session
            
            return res.redirect('/login');
        }

        bcrypt.compare(password, user.password).then(result => {
            if (result) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/')
                })
            }
            
            res.redirect('/');
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        })
    })
}
exports.postSignup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;  
    const password2 = req.body.password2; 

    User.find({ email: email }).then(userData => {
        if (userData.length > 0) {
            
            return res.redirect('/login');
        }

        return bcrypt.hash(password, 12).then(hash => {
            // create the user with the encrypted password 
            const user = new User({ 
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                imgUrl: req.body.imgUrl
            })
            return user.save();
            res.redirect('/login');
        })
       

    }).catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {

    // destroy the session 
    req.session.destroy((err) => {
        res.redirect('/login');
    })
}

const User = require('../models/user');

module.exports.registerPage = async (req, res) => {
    res.render('auth/register',{title: "Register"}); // Ensure 'home' is the correct view file
};

module.exports.NewAccount = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const newUser = new User({ email, username, role });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Service Auto!');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.LoginPage = async(req,res)=>{
    res.render('auth/login', { title: 'Login' });
}

module.exports.LoginRequest = async(req,res)=>{
    req.flash('success','welcome back');
    res.redirect('/');
}

module.exports.userLogoutRequest = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};

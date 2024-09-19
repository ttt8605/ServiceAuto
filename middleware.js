module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You are not authorized');
        return res.redirect('/*')
    }
    next();
    }
    
    module.exports.isManager = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'You need to be logged in to access this page.');
            return res.redirect('/login');
        }
        if (req.user.role !== 'manager') {
            req.flash('error', 'You do not have the required permissions to access this page.');
            return res.redirect('/');
        }
        next();
    }
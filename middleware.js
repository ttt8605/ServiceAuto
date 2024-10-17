module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','Nu sunteti autorizat');
        return res.redirect('/*')
    }
    next();
    }
    
    module.exports.isManager = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Trebuie sa fi autentificat pentru a accesa asta');
            return res.redirect('/login');
        }
        if (req.user.role !== 'manager') {
            req.flash('error', 'Nu aveti permisiune in a accesa aceasta pagina');
            return res.redirect('/');
        }
        next();
    }
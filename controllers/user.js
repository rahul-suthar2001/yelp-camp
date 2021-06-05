const User = require("../models/user");

module.exports.register=(req, res) => {
    res.render('users/register');
}
module.exports.create = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeruser = await User.register(user, password);
        req.login(registeruser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome you are new use of yelp-camp');
            res.redirect('/campground');
        })

    }
    catch(e){
        req.flash('error' , e.message);
        res.redirect('/register');
    }

}

module.exports.loginform = (req, res) => {
    res.render('users/login');
}
module.exports.login =(req,res)=>{
    req.flash("success","welcome back to yelp-camp" );
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

} 
module.exports.logout = (req,res)=>{
    req.logout();
    req.flash("success","bye" );
    res.redirect('/campground');
    
} 
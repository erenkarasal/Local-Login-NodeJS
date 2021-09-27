const validation = require("../validation/foormValidation");
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const passport= require("passport");

require("../authentication/passport/local")


module.exports.getUserLogin = (req, res, next) => {

    res.render("pages/login");
}
module.exports.getUserRegister = (req, res, next) => {

    res.render("pages/register");

}
module.exports.postUserLogin = (req, res, next) => {
    passport.authenticate("local" , {
        successRedirect:"/",
        failureRedirect:"/login",
        failureFlash:true,
        successFlash:true
    })(req , res , next);
}


module.exports.postUserRegister = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const errors = [];

    const validationError = validation.registerValidation(username, password);

    //Serverside validation 
    if (validationError.length > 0) {
        return res.render("pages/register", {
            username: username,
            password: password,
            errors: validationError
        })
    }

    User.findOne({
        username
    }).then(user => {
        if (user) {
            ////user validation
            errors.push({ message: "User already use" });
            return res.render("pages/register", {
                username, password, errors
            })
        }
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) throw err;
                const newUser = new User({
                    username: username,
                    password: hash
            
                });
                newUser.save()
                .then(()=>{
                    console.log("Yeni kullanıcı oluşturuldu");
                    req.flash("flashSuccess" ,"succesfull registered");

                    res.redirect("/");
            
                }).catch(err => console.log(err));
            });
        });
    }).catch(err => console.log(err))

 
};
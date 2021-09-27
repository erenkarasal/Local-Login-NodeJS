const express =require('express');
const exphbs  = require('express-handlebars');
const mongoose =require("mongoose");
const body_parser =require("body-parser");
const User = require("./models/User");
const flash= require("connect-flash");
const session =require("express-session");
const cookieParser=require("cookie-parser")
const usersRouter=require("./routes/users")
const passport =require("passport");

const app=express();
const PORT=5000 || process.env.PORT;

//flash middWares
app.use(cookieParser("passporttutorial"))
app.use(session({ cookie: { maxAge: 60000},
    resave:true,
    secret:"passporttutorial",
    saveUninitialized:true

}));
app.use(flash());

// passport - Initialize

app.use(passport.initialize());
app.use(passport.session());





//gloabal- res.locals

app.use((req , res , next) => {
//our own flash
res.locals.flashSuccess = req.flash("flashSuccess");
res.locals.flashError = req.flash("flashError");

//passport flash
res.locals.passportFailure =req.flash("error");
res.locals.passportSuccess =req.flash("success");

// our logged ın user

res.locals.user=req.user;
next();

})

//mongodb bağlantısı 
mongoose.connect("mongodb://localhost/passportdb", {
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db= mongoose.connection;
db.on("error" , console.error.bind(console,"Connection error"));
db.once("open" , () =>{
    console.log("Connected");
})

//template engine middlware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleWare
app.use(body_parser.urlencoded({extended:false}));



app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Router kullanmak için
app.use(usersRouter);

app.get("/" , (req , res , next) =>{

    User.find({})
    .then(users =>{
        res.render("pages/index" , {users } );
    }).catch(err => console.log(err))

})

app.use(( req,res , next) => {

res.render("static/404");

})

app.listen(PORT , () => {

    console.log("App started");
    
})


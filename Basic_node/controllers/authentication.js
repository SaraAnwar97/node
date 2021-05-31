const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/users');
//configure transporter
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { // can use username & password
    api_key: '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'
  }
}));
exports.getLogin = (req,res,next) => {
// const isLoggedIn = req.get('Cookie').split('=')[1];
  //console.log(req.get('Cookie').split(';')[1].trim().split('=')[1]); //headername:Cookie
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('authentication/login',{
            path : '/login',
            pageTitle: 'Login',
            errorMessage: message
      });

    };


    exports.postLogin = (req,res,next) => {
      const email = req.body.email;
      const password = req.body.password;
     User.findOne({email: email})
     .then(user => {
       if(!user){ //user not found
         req.flash('error','Invalid email or password');
         return res.redirect('/login');
       }
       bcrypt.compare(password, user.password)
       .then(doMatch =>{
         if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err=>{
            console.log(err);
            res.redirect('/');
          });
         }
         req.flash('error','Invalid email or password');
         res.redirect('/login'); // if pws do not match

       })
       .catch(err =>{
         console.log(err);
         res.redirect('/login');
       });
    
     })
     .catch(err => console.log(err));
  };


 exports.getSignup = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
   res.render('authentication/signup',{
     path: '/signup',
     pageTitle: 'Signup',
     errorMessage : message
     
   });
 };

 exports.postSignup = (req,res,next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   User.findOne({ email: email })
   .then(userDoc =>{
     if(userDoc) //user exists
     {
      req.flash('error','Email exists already, please choose a different one');
       return res.redirect('/signup');
     }
    return bcrypt.hash(password,12)
      .then(hashedPassword =>{
        //user does not exist
        const user = new User({
         email: email,
         password: hashedPassword,
         cart: {items:[]}
       });
       return user.save();
      })
      .then(result =>{
        res.redirect('/login');
        //returns a promise
        transporter.sendMail({
          to: email,
          //verified email in sendgrid sender authentication
          from: 'es-SaraAnwar2021@alexu.edu.eg',
          subject: 'signup succeeded!',
          html: '<h1> you successfully signed up! </h1>'
        });
      }).catch(err =>{
        console.log(err);
      });
   })
   .catch(err =>{
     console.log(err);
   });
 };

 exports.postLogout = (req,res,next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/')
  });
 };
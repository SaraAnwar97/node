const express = require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express(); // initialize a new object where express.js will store and manage our app
const errorController = require('./controllers/404');
const User = require('./models/users');
app.set('view engine','ejs'); // setting default template engine to ejs
app.set('views','views');//where i am keeping my html files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authenticationRoutes = require('./routes/authentication');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public'))); // serving files statically so user can access them

app.use((req, res, next) => {
  User.findById("60a1d3760fd0460b2f1cc4c5")
    .then(user => {
      req.user = user; //storing user with id in our req from db
      next();
    })
    .catch(err => console.log(err));
});
// filtering paths
app.use('/admin',adminRoutes);//acessing routes object
app.use(shopRoutes);
app.use(authenticationRoutes);
//adding 404 error page , use: handles all http methods not only get requests
app.use(errorController.get404Page);
//const url = 'mongodb+srv://Sara:Ss4923@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
//const url = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
mongoose
.connect('mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority',{useNewUrlParser: true },{ useUnifiedTopology: true })
.then(result => {
  User.findOne().then(user => {
    if(!user){
    const user = new User({
      name: 'Sara',
      email: 'saraanwar97@gmail.com',
      cart:{
        items: []
      }
  });
  user.save();}
});
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
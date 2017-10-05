var request = require('request');
var express=require('express');
var bodyParser=require('body-parser');
var session = require('express-session');
var Promise=require('promise');
var db = require("./Database/config.js");
var Movie= require("./Database/Model/Movie.js");
var User= require("./Database/Model/User.js");
var util= require("./lib/utility.js");
var app=express();
var port = process.env.PORT||8080;


app.set('views', __dirname + '/views');
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'shhh!',
  resave: false,
  saveUninitialized: true
}));


app.get('/', util.checkUser, function(req, res) {
  // res.render('/index') 
  res.sendFile(__dirname+'/index.html');
});

app.get('/login', function(req, res) {
  // res.render('login');
  res.sendFile(__dirname+'/views/login.html');
});
app.get('/session',function(req,res){
  res.send(JSON.stringify(req.session.user.username))
})

// app.post('/login', function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   User.findOne({ username: username })
//     .exec(function(err, user) {
//       if (!user) {
//        res.sendFile(__dirname+'/views/login.html');
//       } else {
//         User.comparePassword(password, user.password, function(err, match) {
//           if (match) {
//             util.createSession(req, res, user);
//           } else {
//         res.sendFile(__dirname+'/views/login.html');
//           }
//         });
//       }
//     });
// });

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
  .exec(function(err, user) {
    if (!user) {
      // res.redirect('/login');
      res.sendFile(__dirname+'/views/login.html');
    } else {

      if(password==user.password){
        util.createSession(req, res, user);
        // console.log(req.session);
        res.sendFile(__dirname+'/index.html');
      }
      else{
        // res.send(500,'Wrong Password .. Try Again');
        res.status(500).send('Wrong Password .. Try Again');
        console.log('Wrong Password .. Try Again');
        // res.sendFile(__dirname+'/views/login.html');
     }

   }
 });

});



app.get('/logout', function(req, res){
	req.session.destroy(function() {
     console.log(req.session);
     // res.redirect('/login');
    res.sendFile(__dirname+'/views/login.html');
  });
});

app.get('/signUp',function(req, res) {
  res.sendFile(__dirname+'/views/signUp.html');
});


app.post('/signUp', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
  .exec(function(err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser) {
        if (err) {
          res.status(500).send(err);
        }
        util.createSession(req, res, newUser);
        // console.log(req.session);
      });
    } else {
      console.log('Account already exists');
      res.status(500).send('Account Already Exists');
      // res.send(500,'Account Already Exists');
      // res.sendFile(__dirname+'/views/signUp.html');
    }
  });
});



//handling post request for movie data
app.post('/add',function(req,res){
  var record = new Movie ({
   id:req.body.id,
   title:req.body.title,
   release_date:req.body.date,
   popularity: req.body.popularity,
   overview:req.body.overview,
   vote_count:req.body.vote_count,
   vote_average:req.body.vote_average,
   poster_path:req.body.poster_path 
 });

  
  //save novie info in our database
  record.save(function(error, result){
   if(error){
     throw error;
   }
 });
  console.log('added')
  res.send('done');
});

app.get('/go',function(req,res){
  res.sendFile(__dirname+'/views/favoritelist.html')            
})


//fetch data from database
app.get('/favorit',function(req,res){
  console.log('hi')
  Movie.find({},function(err,result){
    if(err)
      throw err;
    console.log(result)
    res.send(JSON.stringify(result))
  })
})

app.listen(port,function(err){
	console.log('connected');
});

module.exports = app;


//trying the database

// var Movie1 = new Movie ({ 
//  id:13560 ,
//  title:"Max", 
//  release_date:"2002-09-10",
//  popularity: '3.938836', 
//  overview:
//    "In 1918, a young, disillusioned Adolph Hitler strikes up a friendship with a Jewish art dealer while weighing a life of passion for art vs. talent at politics",
//  vote_average: '6.2',
//  vote_count: '39',
//  poster_path: "/fzl48iRWkalx6c84lokVBoTQJjS.jpg" })


// var User1 = new User ({
//  id:1,
//  username: "samya",
//  password: "1234"})

// movie1.save(function(error, result){
//    if(error){
//    throw error;
//    }
//    else{
//    console.log("record added");
//     }
// });
// User1.save(function(error, result){
//    if(error){
//    throw error;
//    }
//    else{
//    console.log("record added");
//     }
// });


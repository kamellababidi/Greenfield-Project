var request = require('request');
var express=require('express');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
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
app.use(cookieParser('shhh!, secret'));
app.use(session({
  secret: 'shhh!',
  resave: false,
  saveUninitialized: true
}));


app.get('/', util.checkUser, function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname+'/views/login.html');
});

app.get('/session',function(req,res){
  res.send(JSON.stringify(req.session.username))
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
  .exec(function(err, user) {
    if (!user) {
      res.sendFile(__dirname+'/views/login.html');
    } else {

      if(password==user.password){
        req.session.username = user.username;
        console.log('--------------------> login ', req.session.username)
        res.sendFile(__dirname+'/index.html');
      }
      else{
        res.status(500).send('Wrong Password .. Try Again');
        console.log('Wrong Password .. Try Again');
     }

   }
 });

});



app.get('/logout', function(req, res){
    req.session.username = null;
    console.log(">>>>>>",req.session.username)
    res.sendFile(__dirname+'/views/login.html');
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
        req.session.username = newUser.username;
        console.log('--------------------> login ', req.session.username);
        res.sendFile(__dirname+'/index.html');
      });
    } else {
      console.log('Account already exists');
      res.status(500).send('Account Already Exists');
    }
  });
});



//handling post request for movie data
app.post('/add',function(req,res){
  if (req.session.username) 
  {
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

  
      //start save novie info in our database
      record.save(function(error, newMovie){
       if(error){
         throw error;
       }
     });
//end save

  console.log('added')
  res.send('done');
}
else
{
  console.log ('>>>>>>>>>> rejected');
  res.redirect('/login')
}
});






app.get('/go',function(req,res){
  if (req.session.username){
    res.sendFile(__dirname+'/views/favoritelist.html')            
  }
  else
    res.redirect('/login')
})


//fetch data from database
app.get('/favorit',function(req,res){
  console.log('hi')
  Movie.find({},function(err,newMovie){
    if(err)
      throw err;
    console.log(newMovie)
    res.send(JSON.stringify(newMovie))
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


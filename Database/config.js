var mongoose = require('mongoose');

mongoURI = 'mongodb://maisaa:123456@ds111885.mlab.com:11885/moviebox'; 
mongoose.connect(mongoURI);

// Run in seperate terminal window using 'mongod'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongodb connection open');
});

module.exports = db;

 

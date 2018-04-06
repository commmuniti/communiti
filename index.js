const express = require('express'),
      app = express(),
      engines = require('consolidate'),
      MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      bodyParser = require('body-parser'),
      router = express.Router();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: false }));

MongoClient.connect('mongodb://localhost:27017', function(err, client) {

assert.equal(null, err);
console.log("Successfully connected to MongoDB.");
var db = client.db('communiti');

app.post('/login.html', function (req, res) {
    if (!req.body) return res.send("Error 404");
    var query={"email":req.body.email, "password": req.body.password};
    //console.log(query);
    var email, password;
    db.collection("users").findOne(query, function(err, info){
        assert.equal(null, err);
        if(info == null){
            res.send("User dosen't exists in database");
            return;
        }
        email = info.email;
        password = info.password;
        if(req.body.email == email && req.body.password == password)
            res.render('home.html',
				{
					"name" : info.name, 
					"hometown": info.hometown, 
					"dob": info.dob
				}
            );
        else{
            res.send("Incorrect email or password");
        }
        console.log("email : " + req.body.email +  " Password : " + req.body.password);
    });
});
    
    app.post('/signup.html', function (req, res) {
        if (!req.body) return res.send("Error 404");
        var query={"email":req.body.email, "password": req.body.password, "phone": req.body.phone, "name": req.body.name};
        db.collection("users").insertOne(query, function(err, info){
            assert.equal(null, err);
            res.render('index.html');
        });
    });
    
    app.get('/', function(req, res){
        res.render('index.html');
    });
	app.get('/home.html', function(req, res){
        if(!req.session.user){
            return res.send("404 error");
        }
        res.render('home.html');
    });

    app.post('/home.html', function (req, res) {
        if (!req.body) return res.send("Error 404");
        console.log(req.body.name + " " + req.body.upvotes + " " + req.body.downvotes + " " + req.body.dateOfPublish + " " + req.body.ques);
        
    });
    app.use(function(req, res){
        res.sendStatus(404);
    });
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});
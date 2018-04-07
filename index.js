const express = require('express'),
      app = express(),
      engines = require('consolidate'),
      MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      bodyParser = require('body-parser'),
      router = express.Router();


// For rendering templates
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');

// For using views folder globally and freely
app.use(express.static('views'));

// For reading data sent by html in json format
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDb connection 
MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    // Error Generator
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // Set your database
    var db = client.db('communiti');

    // Process Login form data
    app.post('/home.html', function (req, res) {
        if (!req.body) return res.send("Error 404");
        var query={"email":req.body.email, "password": req.body.password};
        var email, password;
        db.collection("users").findOne(query, function(err, info){
            assert.equal(null, err);
            if(info == null){
                res.redirect('error.html');
                return;
            }
            email = info.email;
            password = info.password;
            if(req.body.email == email && req.body.password == password){
                // Here is the problem: we don't want to render, we want to redirect it to home.html with tghe following data
                res.render('home.html',
                    {
                        "name" : info.name, 
                        "hometown": info.hometown, 
                        "dob": info.dob
                    }
                );
            }
            else{
                res.redirect('error.html');
            }
        });
    });
    
    // Process Sign Up form data
    app.post('/signup.html', function (req, res) {
        if (!req.body) return res.send("Error 404");
        var query={
            "email":req.body.email, 
            "password": req.body.password, 
            "phone": req.body.phone, 
            "name": req.body.name,
            "gender" : req.body.gender,
            "dob" : req.body.dob,
            "hometown": req.body.hometown
        };
        db.collection("users").insertOne(query, function(err, info){
            assert.equal(null, err);
            res.redirect('index.html');
        });
    });

    // // Process ne question form 
    // // #Under development
    app.post('/publishPost', function (req, res) {
        if (!req.body) return res.send("Error 404");
        console.log(req.body.name + " " + req.body.upvotes + " " + req.body.downvotes + " " + req.body.dateOfPublish + " " + req.body.ques);
        
    });

    // Render front page
    app.get('/', function(req, res){
        res.render('index.html');
    });
    
    // Error for unknown page
    app.use(function(req, res){
        res.sendStatus(404);
    });

    // Let the server listen your requests
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});
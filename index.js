const express = require('express'),
      app = express(),
      engines = require('consolidate'),
      MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      bodyParser = require('body-parser'),
      router = express.Router();

var setCookie = require('set-cookie');



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
                res.send('Incorrect email or password');
                return;
            }
            email = info.email;
            password = info.password;
            var questions = [];
            var mySortByDate = {"dateOfPublish" : -1};
            db.collection("questions").find().sort(mySortByDate).toArray(function(err, result){
                for (var i = 0 ; i < result.length ; i++)
                    questions.push(result[i]);
            });
            if(req.body.email == email && req.body.password == password){
                // Way to set-cookies
                // res.cookie("username", info.name, { maxAge: 900000, httpOnly: true });
                // res.cookie("hometown", info.hometown, { maxAge: 900000, httpOnly: true });
                res.render('home.html',
                    {
                        "name" : info.name, 
                        "hometown": info.hometown, 
                        "dob": info.dob,
                        "interests" : info.interests,
                        "questions" : questions 
                    }
                );
            }
            else{
                res.send('Incorrect email or password');
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

    // // Process the question form
    // // #Under development
    app.post('/publishPost', function (req, res) {
        if (!req.body) return res.redirect('error.html');
        console.log(req.body.ques + " " + req.body.name + " " + req.body.upvotes + " " + req.body.downvotes + " " + req.body.dateOfPublish);
        var query={
            "ques":req.body.ques, 
            "upvote": req.body.upvotes, 
            "downvote": req.body.downvotes, 
            "user": req.body.name,
            "tags" : req.body.tags,
            "dateOfPublish" : req.body.dateOfPublish,
            "comments": []
        };
        db.collection("questions").insertOne(query);
    });

    app.post('/publishComment', function (req, res) {
        if (!req.body) return res.redirect('error.html');
        console.log(req.body.ques_id + " " + req.body.content + " " + req.body.likes + " " + req.body.dislikes + " " + req.body.user);
        db.collection("questions").update({"_id": req.body.ques_id},{
            "$push": {
                "comments": {
                    "content": req.body.content,
                    "likes": req.body.likes, 
                    "dislikes": req.body.dislikes, 
                    "dateOfPublish" : req.body.dateOfPublish
                }
            }
        });
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
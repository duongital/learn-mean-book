var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var book1;
var book2;
var books;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//MONGO CLIENT CONNECTION
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    book1 = { title: "Book 1: Company Inc", author: "Highway 37", pages: 22 };
    book2 = { title: "Book 2: Me Before You", author: "Lily Pola", pages: 62 };

    //first we must drop collection
    dbo.collection("books").drop(function (err, delOK) {
        if (err) throw err;
        if (delOK) console.log("reset database...");
        db.close();
    });

    //we create 2 books in the collection
    dbo.collection("books").insertMany([book1, book2], function (err, res) {
        if (err) throw err;
        console.log("book1, book2 created!");
        books = res.result;
        db.close();
    });

    //get all data 
    dbo.collection("books").find({}).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs);
        books = docs;
    });

});

//LOAD STATIC FILES
app.use(express.static(__dirname + '/client'));

//API TO GET HOMEPAGE
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

//GET LIST OF BOOKS
app.get('/book', function (req, res) {
    res.send(books);
})

//GET BOOK NUMBER DATA
app.get('/book/:number', function (req, res) {
    res.send(books[req.params.number]);
})

//CREATE A BOOK
app.post('/book', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log(req.body);
        var dbo = db.db("mydb");
        dbo.collection("books").insertOne(req.body, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });

        //get all data 
        dbo.collection("books").find({}).toArray(function (err, docs) {
            console.log("get books again");
            books = docs;
        });
    });
    res.send(books);
})

//DELETE A BOOK
app.delete('/book/:number', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = books[req.params.number];
        dbo.collection("books").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });

        //get all data 
        dbo.collection("books").find({}).toArray(function (err, docs) {
            console.log("get books again");
            books = docs;
        });
    });
    res.send(books);
})

//UPDATE A BOOK
app.put('/book/:number', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log(req.body);
        var dbo = db.db("mydb");
        var oldvalues = books[req.params.number];
        var newvalues = { $set: req.body };

        //update data
        dbo.collection("books").updateOne(oldvalues, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        })

        //get all data 
        dbo.collection("books").find({}).toArray(function (err, docs) {
            console.log("get books again");
            books = docs;
            console.log(books);
        });

    });
    res.send("update book");
})

//START A SERVER AT PORT 6060 nodemon .\server.js
app.listen(6060, function () {
    console.log("Calling app.listen's callback function.");
    var host = this.address().address;
    var port = this.address().port;
    console.log('Example app listening at localhost', host, port);
});
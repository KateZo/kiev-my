/**
 * Created by ��������� on 26.12.2015.

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});*/
var mongo = require('mongodb');
var host = 'localhost';
var port = '27017';
var db = exports.db = new mongo.Db('kiev', new mongo.Server(host,port,{}),{safe:false});
var db2 = exports.db2 = new mongo.Db('kiev', new mongo.Server(host,port,{}),{safe:false});
var db3 = exports.db3 = new mongo.Db('kiev', new mongo.Server(host,port,{}),{safe:false});
var db4 = exports.db4 = new mongo.Db('kiev', new mongo.Server(host,port,{}),{safe:false});
/*db.open(function(err,db){
    console.log("Conn");
    var collection = db.collection("new");
    collection.insert({hello:"world"});
    collection.findOne({hello:'world'}, function(err, item) {
        console.log(item);
        db.close();
    })

});*/

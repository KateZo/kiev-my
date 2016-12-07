/**
 * Created by ��������� on 05.01.2016.
 */

exports.url = "/a_item";
var bson = require('bson');
var db = require('../mongo').db;
var url = require('url');
var file = require('../file');
exports.run = function(request,response) {
    console.log("Request handler 'article_item' was called.");
    var id = new bson.ObjectID(url.parse(request.url, true).query['id']);
    //console.log(id.toString());
    db.open(function (err, db) {
        var collection = db.collection("articles");//��������� ��� �������� ������
        var arts = collection.find({"_id": id});
        arts.forEach(function (doc) {
            file.view("html/a_item.html", {obj: doc}, response)
        });

    });
};
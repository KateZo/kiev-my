/**
 * Created by Екатерина on 05.01.2016.
 */

exports.url = "/g_item";
var bson = require('bson');
var db = require('../mongo').db;
var url = require('url');
var file = require('file');
exports.run = function(request,response) {
    console.log("Request handler 'goods_item' was called.");
    var id = new bson.ObjectID(url.parse(request.url, true).query['id']);
    //console.log(id.toString());
    db.open(function (err, db) {
        var collection = db.collection("goods");//коллекция где хранятся товары
        var goods = collection.find({"_id": id});
        goods.forEach(function (doc) {
            file.view("html/g_item.html", {obj: doc}, response)
        });

    });
};
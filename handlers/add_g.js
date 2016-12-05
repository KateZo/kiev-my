/**
 * Created by Екатерина on 18.12.2015.
 */
exports.url = "/add_g";
//var fs = require('fs');
//var swig = require('swig');
var url=require('url');
var db = require('../mongo').db;
var file = require('../file');
var bson = require('bson');
var visitor = require('../temp').visitor;
exports.run = function(request,response){
    var id1 = (url.parse(request.url, true).query['id']);
    var action = url.parse(request.url, true).query['action'];
    console.log(action);
    var word, mess;
    var fileclass = "";
    if (action == "'red'"){

        word = "Изменить";
    }else{
        word = "Удалить";
        fileclass = "hide";
        mess = "Вы уверенны, что хотите удалить эту запись?";
    }
    id = new bson.ObjectID(id1);
    //console.log(id);
    if (id1){
        db.open(function(err,datab) {
            var collection = datab.collection("goods");
            var k_obj = collection.find({"_id": id});
            k_obj.forEach(function (doc2,err) {
                var price = doc2.price;
                doc2._id=doc2._id.toString();

                    file.view("html/add_g.html",{
                        mess:mess,
                        word: word,
                        obj: doc2,
                        price:price,
                        active:["","","","active"],
                        fileclass:fileclass,
                        rights:visitor.rights
                    },response);
            });

        });
    }else {
        file.view("html/add_g.html",{
            word: 'Добавить',
            active:["","","","active"],
            rights:visitor.rights
            },response);
    }
    console.log("Request handler 'add_g' was called.");
};



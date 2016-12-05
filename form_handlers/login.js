/**
 * Created by Екатерина on 04.01.2016.
 */
exports.url = "/login";


var db = require('../mongo').db;
//var url = require('url');
var formidable = require('formidable');
var visitor = require('../temp').visitor;
var file = require('../file');
exports.run = function(req,res) {
    console.log("start work with log")
    var pers = {login: "", password: ""};
    var form = new formidable.IncomingForm();
    var mess = "Нет такого пользователя, пожалуйста, пройдите регистрацию";
    form.parse(req, function (err, fields, files) {
    });
    form.on('field', function (nam, value) {

        pers[nam] = value;
    });
    form.on('end', function (field, files) {
        db.open(function (err, datab) {
            var collection = datab.collection("stuff");

            var stuff = collection.find();
            stuff.count(function (err, count) {

                var k = 0;
                stuff.forEach(function (doc) {
                    k++;
                    //console.log((doc.login.toString() == pers['login']));
                    //console.log(doc.password);

                    //console.log(doc.password.toString() == pers['password']);
                    if ((doc.login.toString() == pers['login']) && (doc.password.toString() == pers['password'])) {
                            visitor.sett(doc.name, doc.surname, doc.position,pers['login']);
                        //console.log("I was tring to set");
                        mess="Вы вошли под именем "+doc.name.toString()+" "+doc.surname.toString();
                    }
                    if (k == count) {
                            //console.log('end');
                        file.view("html/default.html",{mess:mess},res);
                        datab.close();

                    }

                });
             });

         });
    });

}

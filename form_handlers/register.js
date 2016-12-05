/**
 * Created by Екатерина on 07.01.2016.
 */
exports.url = "/register";


var db = require('../mongo').db;
//var url = require('url');
var formidable = require('formidable');
var visitor = require('../temp').visitor;
var file = require('../file');
exports.run = function(req,res) {
   // console.log("registration started")
    var login_busy = false;
    var user = {name:"",surname:"",email:"",phone:"",login: "", password: "", position:"user"};
    var form = new formidable.IncomingForm();
    var mess = "";
    form.parse(req, function (err, fields, files) {
    });
    form.on('field', function (nam, value) {
        if (nam=="password_chk"){

        }else
            user[nam] = value;
        //console.log(value);
    });
    form.on('end', function (field, files) {
        db.open(function (err, datab) {
            var collection = datab.collection("stuff");
            console.log(user['password']);
            var stuff = collection.find();
            stuff.count(function(err, count){

                var k = 0;
                stuff.forEach(function (doc) {
                    k++;
                    //console.log((doc.login.toString() == user['login']));

                    if (doc.login.toString() == user['login']) {
                        login_busy = true;
                        mess="Этот логин занят, пожалуйста, выберите другой";
                    }
                    if (k == count) {
                        if (login_busy) {
                            datab.close();
                            file.view("html/register.html", {mess: mess}, res);
                        }else{
                            collection.insert(user);
                            mess = "Успешно зарегистрировано";
                            file.view("html/register.html",{mess:mess},res);

                            datab.close();

                        }




                    }

                });
            });

        });
    });

}
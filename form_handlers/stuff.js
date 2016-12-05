/**
 * Created by Екатерина on 26.12.2015.
*/
var formidable = require('formidable');
exports.url = "/stuff";
var fs = require('fs');
var db = require('../mongo').db;

var file = require('../file');

exports.run = function(req,res){
    var mess = 'Успешно';
    var updated = false;
    var repeat = false;

    db.open(function(err,datab) {
        var collection = datab.collection("stuff");
        var pers = {name: "", surname: "", position: "", log_in: "", pas: ""};
        var form = new formidable.IncomingForm();
        var met = "";
        var counter = 0;

        form.parse(req, function (err, fields, files) {
        });

        form.on('field', function (nam, value) {
            console.log(nam);
            if (nam == "add_red") {
                console.log(value);
                met = value.toString();
            }
            else if (nam == "optionsRadios") {
                switch (value) {
                    case "option1":
                        pers['position'] = "admin";
                        break;
                    case "option2":
                        pers['position'] = "moderator";
                        break;
                    case "option3":
                        pers['position'] = "user";
                        break;
                }
            } else
                pers[nam] = value;
        });
        form.on('end', function (field, files) {
            var stuff = collection.find();
            stuff.count(function (err, count) {

                stuff.forEach(function (doc) {
                    console.log(met);
                    counter = counter + 1;
                    if (met == "del"){
                        if (pers['log_in'] == doc.login.toString()) {
                            updated = true;
                            collection.remove({"login": pers['log_in']});
                        }
                        if (counter == count) {
                            if (updated == false)
                                mess = "Провал";
                            file.view("html/default.html", {mess: mess}, res);
                            datab.close();
                        }
                    }else {
                        if (met == "red") {
                            if (pers['log_in'] == doc.login.toString()) {
                                updated = true;
                                collection.update({"login": pers['log_in']}, {
                                    name: pers['name'],
                                    surname: pers['surname'],
                                    login: pers['log_in'],
                                    position: pers['position'],
                                    password: doc.password.toString()
                                });
                            }
                            if (counter == count) {
                                if (updated == false)
                                    mess = "Провал";
                                file.view("html/default.html", {mess: mess}, res)
                                datab.close();
                            }
                        } else {
                            if (pers['log_in'] == doc.login.toString()) {
                                mess = "Этот логин занят";
                                repeat = true;
                            } else if ((counter == count) && (repeat == false)) {
                                collection.insert({
                                    name: pers['name'],
                                    surname: pers['surname'],
                                    login: pers['log_in'],
                                    position: pers['position'],
                                    password: pers['pas']
                                });
                                file.view("html/default.html", {mess: mess}, res)
                                datab.close();
                            }


                        };
                    }
                });
            });
        });
    });
}

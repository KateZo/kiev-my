/**
 * Created by Екатерина on 18.12.2015.
 */
/*exports.url = "/add_a";
var fs = require('fs');
var db = require('../mongo').db;
var db1 = require('../mongo').db2;
var formidable = require('formidable');
var file = require('../file');
var bson = require('bson');
exports.run = function(req,res){

    var mess = 'Успешно добавлено';
    var files_present = false;
    var img = 0;//инициализация имг на всякий пожарный
    //var today = new Date();
    var action="";// изменить или удалить
    db.open(function(err,datab){
        var collection = datab.collection("tours");
        var imag = collection.findOne();
        img = imag.image_count;
        console.log("Image: "+img);
        var images = [];//пути к картинкам
        var fields = {name:"",text:"",date:"",status:"",author:""};
            var form = new formidable.IncomingForm();
            form.uploadDir = "./storage/pictures_articles/";

            form.parse(req, function(err, fields, files) {
            });

            form.on('field', function(nam, value) {
                //console.log(nam);
                switch(nam){
                    case 'Изменить': action = 'Изменить';
                        fields[nam] = value;
                        break;
                    case 'Удалить': action = 'Удалить';
                        fields[nam] = value;
                        break;
                    default: fields[nam] = value;
                };
            });
            form.on('file', function(name, file) {
                //console.log("file coming up");
                if (file.size>0) {
                    files_present = true;
                    var a = file.name.split('.');
                    var ext = a[a.length - 1];//достаем расширение файла
                    var for_mongo = "/pictures_articles/img" + img + '.' + ext;
                    var new_path = "./storage/pictures_articles/img" + img + '.' + ext;
                    img = img + 1;

                    images.push(for_mongo);
                    fs.rename(file.path, new_path, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
            form.on('end', function(field, files) {

                db1.open(function (err, dab) {
                    var collection_art = dab.collection("articles");
                    //console.log(fields['insert']);
                    //console.log(fields['insert']=='undefined');
                    //console.log(files_present);

                    if (action == "Удалить"){
                        var id = new bson.ObjectID(fields[action].toString());
                        collection_art.remove({"_id":id});
                    }else if ((fields['Изменить'] != undefined) && (fields['Изменить'] != "")) {
                            //console.log("Update!");
                        var id = new bson.ObjectID(fields[action].toString());
                            //console.log(id);
                            var item = collection_art.find({"_id": id});
                            item.forEach(function (doc_item) {
                                doc_item.name = fields['name'];
                                doc_item.text = fields['text'];
                                doc_item.date = fields['date'];
                                doc_item.author = fields['author'];
                                if (files_present)
                                    doc_item.pictures = images;
                                collection_art.save(doc_item);
                                dab.close();

                            }, function (err) {
                                console.log(err);
                            });


                    }else {
                    //console.log("NORM!");
                    collection_art.insert({
                        name: fields['name'],
                        text: fields['text'],
                        date: fields['date'],
                        author: fields['author'],
                        pictures: images
                    });
                    dab.close();
                }

                    file.view("html/add_a.html",{mess:mess,word:"Добавить"},res)

                    db.open(function (err, db) {
                        var collection_img2 = db.collection("img_a");
                        collection_img2.update({}, {"image": img});
                        db.close();
                    });
                });
            });
        });
    });
    console.log("Request handler 'add_a' was called.");
};


*/
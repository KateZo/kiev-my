/**
 * Created by Екатерина on 26.12.2015.
*/

exports.url = "/add_g";
var fs = require('fs');
var db = require('../mongo').db;
var db1 = require('../mongo').db2;
var formidable = require('formidable');
var file = require('../file');
var bson = require('bson');
//var visitor =
exports.run = function(req,res){

    var mess = 'Успешно добавлено!';
    var files_present = false;
    var today = new Date();//дата нужна для хронологии изменения цен
    var action="";// изменить или удалить

    db.open(function(err,datab){
        var collection_img = datab.collection("img");
        var imag = collection_img.find();
        var obj_pr;//объект для нвой цены в массив цен
        imag.forEach(function(doc){
            img=Number(doc.image);//извлекаем номер картники
            datab.close();

            var images = [];//пути к картинкам
            var fields = {name:"",description:"",rate:"",geo_x:"",geo_y:""};
            var form = new formidable.IncomingForm();
            form.uploadDir = "./storage/pictures_tours/";

            form.parse(req, function(err, fields, files) {
            });

            form.on('field', function(nam, value) {
                console.log(nam);
                switch(nam){
                    /*case 'prices': obj_pr = {date: today, price: Number(value)};
                        fields['price'] = Number(value);
                        break;
                    case 'amount': fields[nam] = Number(value);
                        break;*/
                    case 'Изменить': action = 'Изменить';
                        fields[nam] = value;
                        break;
                    case 'Удалить': action = 'Удалить';
                        fields[nam] = value;
                        break;
                    default: fields[nam] = value;
                };    /*if (nam=='prices') {
                    obj_pr = {date: today, price: Number(value)};
                    fields['price'] = Number(value);
                    //fields['prices'].push(obj_pr);

                }else if (nam == 'amount')
                    fields[nam] = Number(value);
                else
                    fields[nam] = value;*/
            });
            form.on('file', function(name, file) {
                //console.log("file coming up");
                if (file.size>0) {
                    files_present = true;
                    var a = file.name.split('.');
                    var ext = a[a.length - 1];//достаем расширение файла
                    var for_mongo = "/pictures_tours/img" + img + '.' + ext;
                    var new_path = "./storage/pictures_tours/img" + img + '.' + ext;
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
                    var collection_goods = dab.collection("tour_dot");
                    console.log(fields['Изменить']);
                    //console.log(files_present);

                    if (action == "Удалить"){
                        var id = new bson.ObjectID(fields[action].toString());
                        collection_goods.remove({"_id":id});
                    }else if ((fields['Изменить'] != undefined) && (fields['Изменить'] != "")) {
                            //console.log("Update!");
                            var id = new bson.ObjectID(fields[action].toString());
                            //console.log(id);
                            var item = collection_goods.find({"_id": id});

                            //console.log(item);
                            //var last_price = collection_goods.find({"_id": id}, {prices: {$slice: -1}});
                            item.forEach(function (doc_item) {
                                //fields['prices'] = doc_item.prices;
                                /*last_price.forEach(function (doc_pr) {
                                    if (doc_pr.price != fields['prices'].price) {
                                        fields['prices'].push(obj_pr);
                                    }*/
                                    doc_item.name = fields['name'];
                                    doc_item.description = fields['description'];
                                    doc_item.rate = fields['rate'];
                                    doc_item.geo = {x:fields['geo_x'],y:fields['geo_y']};
                                    //doc_item.amount = fields['amount'];
                                    if (files_present)
                                        doc_item.pictures = images;
                                    collection_goods.save(doc_item);
                                    dab.close();
                                    /*if (files_present) {//новые картники
                                     console.log("files_present!!!")
                                     collection.update({"_id":id},{
                                     name: fields['name'],
                                     description: fields['description'],
                                     prices: fields['prices'],
                                     price:fields['price'],
                                     amount: fields['amount'],
                                     pictures: images
                                     });
                                     }else{
                                     collection.update({"_id":id},{
                                     name: fields['name'],
                                     description: fields['description'],
                                     prices: fields['prices'],
                                     price:fields['price'],
                                     amount: fields['amount'],
                                     pictures: doc1.pictures
                                     });
                                     }*//*
                                }, function (err) {
                                    console.log(err);
                                });*/
                            }, function (err) {
                                console.log(err);
                            });

                        } else {
                        //console.log("NORM!");
                        collection_goods.insert({
                            name: fields['name'],
                            description: fields['description'],
                            rate:fields['rate'],
                            geo_x:fields['geo_x'],
                            geo_y:fields['geo_y'],
                            pictures: images
                        });
                        dab.close();
                    }

                    file.view("html/add_g.html",{mess:mess,word:"Добавить"},res)

                    db.open(function (err, db) {
                        var collection_img2 = db.collection("img");
                        collection_img2.update({}, {"image": img});
                        db.close();
                    });
                });
            });
        });
    });
};

/**
 * Created by Екатерина on 06.01.2016.
 */
exports.url = "/orders";
var url=require('url');
var swig = require('swig');
var db = require('../mongo').db;
//var db2 = require('../mongo').db2;
//var url = require('url');
//var formidable = require('formidable');
var file = require('../file');
var visitor = require('../temp').visitor;
var bson = require('bson');
exports.run = function(request,response) {
    console.log("Request handler 'orders' was called.");
    var lim = 20;//кол-во записей на стр.
    var archive = url.parse(request.url,true).query['archive'];
    var del = url.parse(request.url,true).query['delete'];
    //console.log(archive!=undefined);
    var page = Number(url.parse(request.url,true).query['page']);//текущая страница
    var sort={date:1};
    var status = "заказ";
    var s = url.parse(request.url,true).query['sort'];//метод сортировки
    switch(s) {
        case "order":
            status="заказ";
            break;
        case "archive":
            status="архив";
            break;
    }
    var orders_arr=[];//массив э-тов на одной стр
    var cp = [1,2,3,4,5];//массив страниц для скрола
    var c = [];//массив классов для скрола
    for (var i=0;i<5;i++)
        c[i]="";

    if(page)//если не NaN
        for (var i=0;i<5;i++)
            cp[i]=page+i;

    var m = new swig.Swig({
        cache: false,
        loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
    });

    db.open(function(err,db) {

        var collection = db.collection("orders");//коллекция где хранятся товары
        var tp = 20;//кол-во записей(по "умолчанию" 20 поставила)
        var ost = 0;
        if ((archive != undefined)&&(archive!="")||(del != undefined)&&(del!="")){
            if ((archive != undefined)&&(archive!="")) {
                var id = new bson.ObjectID(archive);
                var order = collection.find({_id: id});
                order.forEach(function (doc) {
                    doc.status = "архив";
                    var seller = visitor.get_name() + " " + visitor.get_surname();
                    doc.seller = seller;
                    collection.save(doc);
                    file.view("html/default.html", {mess: "Перемещено в архив"}, response);
                    db.close();
                });
            }else{
                var id = new bson.ObjectID(del);
                var order = collection.remove({_id: id});
                db.close();
                file.view("html/default.html", {mess: "Удалено"}, response);
            }
        }else {
            var orders = collection
                .find({status: status});

            orders.count(function (err, count) {
                if (count == 0) {
                    file.view("html/default.html", {mess: "Нет данных, отвечающих запросу..."}, response);
                } else {
                    orders.sort(sort)
                        .skip(lim * (page - 1))
                        .limit(lim);//на странице lim записи, берем пачку из базы

                    //console.log(count);
                    ost = Number(count) % lim;

                    tp = (Number(count) - ost) / lim;
                    if (ost != 0)
                        tp = tp + 1;
                    //console.log(tp);
                    var p = cp[0];//формируем скролл (да, прямо тут)
                    switch (p) {
                        case 1:
                            c[0] = "active";
                            cp = [1, 2, 3, 4, 5];
                            break;
                        case 2:
                            c[1] = "active";
                            cp = [1, 2, 3, 4, 5];
                            break;
                        case tp :
                            c[4] = "active";
                            cp = [tp - 4, tp - 3, tp - 2, tp - 1, tp];
                            break;
                        case tp - 1 :
                            c[3] = "active";
                            cp = [tp - 4, tp - 3, tp - 2, tp - 1, tp];
                            break;
                        default:
                            c[2] = "active";
                            cp[0] = cp[0] - 2;
                            cp[1] = cp[1] - 2;
                            cp[2] = cp[2] - 2;
                            cp[3] = cp[3] - 2;
                            cp[4] = cp[4] - 2;
                            break;
                    }
                    for (var i = 0; i < 5; i++)
                        if ((cp[i] < 1) || (cp[i] > tp))
                            c[i] = "hide";
                    //console.log(cp);


                    var k = 1;
                    orders.forEach(function (doc) {
                        doc._id = doc._id.toString();
                        var date = doc.date;
                        //console.log(date);
                        //console.log(Date.parse(date));
                        doc.date = date.toString().substring(4, 24);


                        orders_arr.push(doc);
                        //console.log(orders_arr);
                        //console.log(orders_arr[0].order);
                        m.renderFile("html/orders.html", {
                            orders: orders_arr,
                            total_pages: tp,
                            current_pages: cp,
                            c: c,
                            sort: status,
                            rights:visitor.rights
                            //sort:sorting

                        }, function (err, out) {
                            if (err) {
                                console.log(err);
                            }
                            else {

                                var buffer = new Buffer(out);
                                response.writeHead(200, {
                                    'Content-Length': buffer.length,
                                    'Content-Type': 'text/html'
                                });
                                response.write(buffer);
                                //console.log(((p==tp)&&(k==ost)));
                                //console.log(k==lim);
                                if ((k == lim) || ((p == tp) && (k == ost))) {//чтоб не было ошибки
                                    //console.log("Lim: "+lim+"ost: "+ost);
                                    response.end();
                                    db.close();
                                }

                                k = k + 1;
                            }
                        });
                    });
                }
            });
        }
    });
};
/**
 * Created by ≈катерина on 28.12.2015.
 */
exports.url = "/goods";

var swig = require('swig');
//var db = require('../mongo').db;
var db2 = require('../mongo').db2;
var url = require('url');
//var formidable = require('formidable');
var file = require('../file');
var visitor = require('../temp').visitor;
var bson = require('bson');


exports.run = function(request,response){
    try {
        console.log("Request handler 'goods' was called.");
        //console.log(visitor);
        //var buy_enable = "disabled";
        //if (visitor.name != "")
        //    buy_enable = "";
        var search = "";
        if (url.parse(request.url, true).query['search']) {
            search = (url.parse(request.url, true).query['search']).toString();
        }

        var page = Number(url.parse(request.url, true).query['page']);//текущая страница
        /*var pf = Number(url.parse(request.url, true).query['pf'])//границы цен из запроса
        var pt = Number(url.parse(request.url, true).query['pt'])

        var say = "";
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
        });
        var max_price = 300;
        var price = {from: 0, to: max_price};

        form.on('field', function (nam, value) {
            console.log("Name of field:" + nam);
            if (nam == "search") {
                search = value.toString();
            }
            else if (nam == 'from' || nam == 'to') {
                pf = 0;
                pt = 0;
                price[nam] = Number(value);
                //console.log("Value:");
                //console.log(value);
            } else {
                //console.log("Get buy ^^");
                db.open(function (error, database) {

                    var collection = database.collection("tour_dot");
                    id = new bson.ObjectID(nam);
                    var goods = collection.find({"_id": id});
                    goods.forEach(function (doc_am) {
                        var is_in_cart = false;

                        var arr = visitor.get_cart();

                        //console.log(arr);
                        try {
                            //console.log(arr[0]);
                            //console.log(arr.length);
                            //console.log(arr[0].id);
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i].id.toString() == id.toString()) {
                                    //console.log("changing item");
                                    is_in_cart = true;
                                    visitor.set_amount(value, arr[i].id);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        if (!is_in_cart) {
                            if (doc_am.amount < Number(value))
                                say = "Нет такого количества";
                            else {
                                visitor.add_to_cart(doc_am.name, Number(value), doc_am.price, doc_am._id);
                                console.log(visitor);
                                doc_am.amount = doc_am.amount - value;
                                //console.log(doc_am.amount);
                                say = "успешно добавлено";
                                //collection.save(doc_am);
                                database.close();
                            }
                        }
                    });
                });

            }
        });
        */
        var lim = 9;//кол-во записей на стр.

        var sort = {name: 1};
        var sorting;
        var s = url.parse(request.url, true).query['sort'];//метод сортировки
        switch (s) {
            case "az":
                sort = {name: 1};
                sorting = "az";
                break;
            case "za":
                sort = {name: -1};
                sorting = "za";
                break;
            case "low" :
                sort = {price: 1};
                sorting = "low";
                break;
            case "high" :
                sort = {price: -1};
                sorting = "high";
                break;
        }

        //console.log(price);
        /*if ((price['from'] < 0) || (price['to'] < 0) || (price['to'] <= price['from']))//допустимая ли форма
            price = {from: 0, to: max_price};
        */
        var tour_dot_arr = [];//массив э-тов на одной стр
        var cp = [1, 2, 3, 4, 5];//массив страниц для скрола
        var c = [];//массив классов для скрола
        for (var i = 0; i < 5; i++)
            c[i] = "";

        if (page)//если не NaN
            for (var i = 0; i < 5; i++)
                cp[i] = page + i;

        var m = new swig.Swig({
            cache: false,
            loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
        });

        db2.open(function (err, db) {
            console.log(err);

            var collection = db.collection("tour_dot");//коллекция где хранятся товары
            var tp = 20;//кол-во записей(по "умолчанию" 20 поставила)
            var ost = 0;

            /*if ((pf) || (pt)) {//если не в форме пришли, а в запросе
                price['from'] = pf;
                price['to'] = pt;
            }*/
            //console.log("pf: "+pf+" pt: "+pt);
            var reg_search = new RegExp(search, "i");
            console.log("Search: " + search + " reg: " + reg_search);
            var q;
            if (search != "") {
                q = {$or: [{"name": {$regex: reg_search}}, {"description": {$regex: reg_search}}]};
            } /*else {
                q = {"price": {$gt: price['from'] - 1, $lt: price['to'] + 1}};
            }*/
            var tour_dot = collection.find(q);
            tour_dot.count(function (erro, count) {
                console.log(erro);
                //console.log(count);
                if (count == 0) {
                    file.view("html/default.html", {mess: "Нет данных, отвечающих запросу..."}, response)
                } else {
                    tour_dot.sort(sort)
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
                    console.log(cp);


                    var k = 1;
                    tour_dot.forEach(function (doc) {

                        doc._id = doc._id.toString();//чтобы передать запросом сщ страницы
                        tour_dot_arr.push(doc);

                        m.renderFile("html/goods.html", {
                            xxx: tour_dot_arr,
                            total_pages: tp,
                            current_pages: cp,
                            c: c,
                            sort: sorting,
                            //from: price['from'],
                            //to: price['to'],
                            //buy: buy_enable,
                            rights: visitor.rights,
                            active: ["active", "", "", ""],
                            search: search
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
        });
    }catch(e){
        console.log(e);
    }
};

/**
 * Created by ≈катерина on 28.12.2015.
 */
exports.url = "/all_goo";

var swig = require('swig');
var db = require('../mongo').db;
var url = require('url');
var formidable = require('formidable');
var util = require('util');
var visitor = require('../temp').visitor;
exports.run = function(request,response){
    console.log("Request handler 'all_goo' was called.");
    //var pf = Number(url.parse(request.url,true).query['pf'])
    //var pt = Number(url.parse(request.url,true).query['pt'])
    //var form = new formidable.IncomingForm();
    //form.parse(request, function(err, fields, files) {
    //});
    //var max_price=100;
    //var price = {from:0,to:max_price};
    /*form.on('field', function(nam, value) {
        pf = 0;
        pt = 0;
        price[nam]=Number(value);
        console.log("Value:")
        console.log(value);
    });
*/
    var lim = 20;//кол-во записей на стр.
    var page = Number(url.parse(request.url,true).query['page']);//текущая страница
    var sort={name:1};
    var sorting;
    var s = url.parse(request.url,true).query['sort'];//метод сортировки
    switch(s) {
        case "az":
            sort = {name: 1};
            sorting="az";
            break;
        case "za":
            sort = {name: -1};
            sorting="za";
            break;
        case "low" :
            sort = {price: 1};
            sorting="low";
            break;
        case "high" :
            sort = {price: -1};
            sorting="high";
            break;
    }


    //console.log(price);*/
    //var from = $("#from").val();
    //var to = $('#to').val();
    //console.log(from);
    //console.log(to);

    var goods_arr=[];//массив э-тов на одной стр
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

        var collection = db.collection("goods");//коллекция где хранятся товары
        var tp = 20;//кол-во записей(по "умолчанию" 20 поставила)
        var ost = 0;

        var goods = collection
            .find()

        goods.count(function(err,count){
            goods.sort(sort)
                .skip(lim*(page-1))
                .limit(lim);//на странице lim записи, берем пачку из базы

            //console.log(count);
            ost=Number(count)%lim;

            tp=(Number(count)-ost)/lim;
            if (ost!=0)
                tp=tp+1;
            //console.log(tp);
            var p = cp[0];//формируем скролл (да, прямо тут)
            switch(p){
                case 1: c[0]="active";cp=[1,2,3,4,5];
                    break;
                case 2: c[1]="active";cp=[1,2,3,4,5];
                    break;
                case tp :c[4]="active";cp=[tp-4,tp-3,tp-2,tp-1,tp];
                    break;
                case tp-1 :c[3]="active";cp=[tp-4,tp-3,tp-2,tp-1,tp];
                    break;
                default:c[2]="active";cp[0]=cp[0]-2;cp[1]=cp[1]-2;cp[2]=cp[2]-2;cp[3]=cp[3]-2;cp[4]=cp[4]-2;
                    break;
            }
            for(var i=0;i<5;i++)
                if ((cp[i]<1)||(cp[i]>tp))
                    c[i]="hide"
            //console.log(cp);


            var k = 1;
            goods.forEach(function(doc){
                doc._id=doc._id.toString();
                goods_arr.push(doc);

                m.renderFile("html/all_goo.html", {
                    xxx: goods_arr,
                    total_pages:tp,
                    current_pages:cp,
                    c:c,
                    sort:sorting,
                    rights:visitor.rights

                }, function(err,out) {
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
                        if ((k==lim)||((p==tp)&&(k==ost))) {//чтоб не было ошибки
                            //console.log("Lim: "+lim+"ost: "+ost);
                            response.end();
                            db.close();
                        }

                        k=k+1;
                    }
                });
            });
        });
    });
};

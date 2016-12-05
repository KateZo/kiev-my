/**
 * Created by Екатерина on 18.12.2015.
 */
exports.url = "/stuff";

var swig = require('swig');
var db = require('../mongo').db;
var url = require('url');
var visitor = require('../temp').visitor;
exports.run = function(request,response){
    console.log("Request handler 'stuff' was called.");

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
        case "main" :
            sort = {rights: 1};
            sorting="a_az";
            break;
        case "not_main" :
            sort = {rights: -1};
            sorting="a_za";
            break;
    }
    var stuff_arr=[];//массив э-тов на одной стр
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
        var collection = db.collection("stuff");//коллекция где хранятся товары
        var tp = 20;//кол-во записей(по "умолчанию" 20 поставила)
        var ost = 0;
        var stuff = collection
            .find()

        stuff.count(function(err,count){
            stuff.sort(sort)
                .skip(lim*(page-1))
                .limit(lim);//на странице lim записи, берем пачку из базы

            //onsole.log(count);
            ost=Number(count)%lim;

            tp=(Number(count)-ost)/lim;
            if (ost!=0)
                tp=tp+1;

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
            stuff.forEach(function(doc){

                stuff_arr.push(doc);

                m.renderFile("html/stuff.html", {
                    xxx: stuff_arr,
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

                        if ((k==lim)||((p==tp)&&(k==ost))) {//чтоб не было ошибки

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



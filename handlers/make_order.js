/**
 * Created by Екатерина on 06.01.2016.
 */
exports.url = "/make_order";
var visitor = require('../temp').visitor;
var file = require('../file');
var db = require('../mongo').db3;
var db2 = require('../mongo').db4;
exports.run = function(request,response) {

        var today = new Date();
        var cart = visitor.get_cart();
        var name = visitor.get_name()+" "+visitor.get_surname();
        var con={name:name,phone:visitor.get_phone(),login:visitor.get_login()};
        var sum = visitor.cart_sum();
        var order = {order:cart,date:today,consumer:con,status:"заказ",summa:sum}
        db.open(function(err,db) {
            var collect = db.collection("orders");
            collect.insert(order);
            visitor.clean_cart();
            db.close();

            db2.open(function(error,db1) {
                var goods = db1.collection("goods");
                for (var i=0;i<cart.length;i++){
                    //console.log("New amount will be");
                    var f = goods.find({"_id": cart[i].id});
                    //console.log(typeof cart[i]);
                    //console.log(cart[i].amount);
                    var am = Number(cart[i].amount);
                    f.forEach(function(my_doc){
                        //console.log(my_doc);
                        my_doc.amount = my_doc.amount - am;
                        goods.save(my_doc);
                        db1.close();

                    },function(err){console.log(err);});
                        /*
                        });*/


                }

            });

        });

    file.view("html/default.html",{mess:"Заказ поступил в обработку"},response)

}
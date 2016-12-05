/**
 * Created by Екатерина on 18.12.2015.
 */
exports.url = "/cart";
var visitor = require('../temp').visitor;
var file = require('../file');
exports.run = function(request,response){

    console.log("Request handler 'cart' was called.");
    file.view("html/cart.html",{
            cart:visitor.cart,
            sum: visitor.cart_sum(),
            active:["","","active",""]
        },response);


};



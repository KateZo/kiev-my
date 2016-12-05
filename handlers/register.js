/**
 * Created by Екатерина on 07.01.2016.
 */
exports.url = "/register";

var file = require('../file');
exports.run = function(request,response){
    file.view("html/register.html",{},response);
    console.log("Request handler 'register' was called.");
};

exports.url = "/login";

var file = require('../file');
exports.run = function(request,response){
    file.view("html/login.html",{},response);
    console.log("Request handler 'login' was called.");
};



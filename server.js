/**
 * Created by ��������� on 14.12.2015.
 */
var http = require("http");
var url = require("url");
var file = require('./file');

function run(route){
    function onRequest(request,response){

            var pathname = url.parse(request.url);
        console.log("I get request from"+pathname.pathname);
            pathname = pathname.pathname;
            route(pathname, request, response);
       }
    http.createServer(onRequest).listen(3001/*,function(request,response){
        file.view("html/login.html",{},response);
        console.log("First if");
    }*/);

}
exports.run = run;
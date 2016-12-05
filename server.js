/**
 * Created by Екатерина on 14.12.2015.
 */
var http = require("http");
var url = require("url");


function run(route){
    function onRequest(request,response){
            var pathname = url.parse(request.url);
        //console.log("I get request from"+pathname.pathname);
            pathname = pathname.pathname;
            route(pathname, request, response);
       }
    http.createServer(onRequest).listen(3000);
}
exports.run = run;
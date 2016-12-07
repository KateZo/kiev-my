/**
 * Created by ��������� on 15.12.2015.
 */
var handlers = require("./handlers");
var form_handlers = require("./form_handlers");


function route(pathname,request,respond){

     if (pathname.search(/^.*[\.](?:css|js|jpe?g|gif|woff|map|woff2|png|ico)$/i) != -1){
        console.log("pathname = "+pathname);
        handlers['/storage'](request,respond,pathname);
    }else {
        //���������, ��������� ������� �� ������(������� �����)
        console.log("I get request from"+pathname);
        if ((request.method.toLowerCase()=='get')&&(typeof handlers[pathname] == 'function')) {
            console.log("It's get request");
            handlers[pathname](request, respond);
        } else {
            console.log("It's not get reauest");
            if((pathname == "/goods")||(pathname == "/articles"))
                handlers[pathname](request, respond);
            else if (typeof form_handlers[pathname] == 'function') {

                form_handlers[pathname](request, respond);
            } else {
                if (pathname != "/favicon.ico") {
                    //console.log(typeof handlers[pathname])
                    console.log("No request handler found for " + pathname);
                }
            }
        }
    }
}
exports.route = route;


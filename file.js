/**
 * Created by ��������� on 26.12.2015.
 */
var fs = require('fs');
var mime = require('mime');
var typeOf = require('./use').typeOf;
var swig = require('swig');
var visitor = require('./temp').visitor;

    exports.file = function(path,request,response){//module.
        fs.exists(path, function(exists){
            if(exists){
                var mimeType = typeOf(mimeType, 'string') ? mimeType : mime.lookup(path);
                response.writeHead(200, { 'Content-Type': mimeType });
                var readable = fs.createReadStream(path);
                readable.pipe(response);
                readable.on('error', function(error){
                    if(typeOf(callError, 'function')) callError(error);
                    else errorBack(response, 404);
                });
                readable.on('end', function(){
                    response.end();
                });
            }
            else errorBack(response, 404);
        });
    };
var errorBack = function(response, code){
    response.writeHead(code, { 'Content-Type': 'text/plain' });
    response.end('Not found.');
};
var m = new swig.Swig({
    cache: false,
    loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});
exports.view = function(path,query,res){

    m.renderFile(path, query, function(err,out) {
        var active = ["","","",""];
        //console.log("hi");
        if (path == "/goods")
            active[0]="active";
        if (path == "/articles")
            active[1]="active";
        if (path == "/cart")
            active[2]="active";
        if (path == "/add_g"||path == "/add_a"||path == "/all_goo"||path == "/all_art"||path == "/stuff"||path == "/orders")
            active[3]="active";
        if (err) {
            console.log(err);
        }
        else
        {
            m.renderFile("html/menu.html",{rights:visitor['rights'],active:active}, function(err,out2) {
                //console.log("hi");
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(typeof (out));
                    var buf10 = out.substring(0,out.indexOf("wrapper container")+19);
                    var buf11 = out.substring(out.indexOf("start_here-->")+13);
                    var buffer = new Buffer(buf10+out2+buf11);
                    res.writeHead(200, {
                        'Content-Length': buffer.length,
                        'Content-Type': 'text/html'

                    });
                    res.write(buffer);
                    res.end();
                }
            });
        }
    });
};
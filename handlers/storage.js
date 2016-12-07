/**
 * Created by ��������� on 25.12.2015.
 */
exports.url = "/storage";
var file = require('../file');
exports.run = function(request,response,pathname){

    var path = './storage'+pathname;
    //console.log(path);
    file.file(path,request,response);

    console.log("Request handler for "+path+" was called.");
};
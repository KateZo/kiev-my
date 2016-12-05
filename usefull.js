/**
 * Created by Екатерина on 18.12.2015.
 */
var tpl = require('../../tpl');
var typeOf = require('/use').typeOf;
var renderFile =
    exports.renderFile = function(request, response, path, data, callError){
    tpl.renderFile(path, data, function(error, out){
        if(!error){
            var buffer = new Buffer(out);
            response.writeHead(200, {
                'Content-Length': buffer.length,
                'Content-Type': 'text/html'
            });
            response.write(buffer);
            response.end();
        }
        else if(typeOf(callError, 'function')) callError(error);
        else throw error;
    });
};
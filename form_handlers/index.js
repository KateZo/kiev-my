/**
 * Created by Екатерина on 18.12.2015.
 */
var handler = [
    require("./add_a"),
    require("./add_g"),
    require("./login"),
    require("./stuff"),
    require("./register")
];

var handlers = {};
for (var i=0;i<handler.length;i++){

    handlers[handler[i].url] = handler[i].run;

}

module.exports = handlers;
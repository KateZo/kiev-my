/**
 * Created by Екатерина on 18.12.2015.
 */
var handler = [
    require("./add_g"),
    require("./storage"),
    require("./goods"),
    require("./add_a"),
    require("./articles"),
    require("./all_art"),
    require("./all_goo"),
    require("./login"),
    require("./stuff"),
    require("./good_view"),
    require("./article_view"),
    require("./cart"),
    require("./orders"),
    require("./make_order"),
    require("./register")
 // require("./upload")
];

var handlers = {};
for (var i=0;i<handler.length;i++){

    handlers[handler[i].url] = handler[i].run;

}
console.log("Ready");
module.exports = handlers;
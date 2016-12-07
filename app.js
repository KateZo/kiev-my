var server = require("./server");
var router = require("./router");


server.run(router.route);

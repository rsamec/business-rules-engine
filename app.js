/**
 * Created by rsamec on 22.6.2014.
 * Description: The entry point for app
 */

var http = require("http");
http.createServer(function(req, res){
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end('Hello worldsdfsdfsasa\n');
}).listen(1227,'127.0.0.1');
console.log('Server is running http://127.0.0.1:1227');

var http = require('http');

var connect = require('connect');
var serve = require('serve-static');

var app = connect();
var i = 5;

app.use(serve('public'));
app.use(function(req, res){
	if (req.url === '/getItem')
	res.end(""+i++);
});

http.createServer(app).listen(4000);
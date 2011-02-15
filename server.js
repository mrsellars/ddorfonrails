var http = require('http'),
path = require('path'),
paperboy = require('./vendor/paperboy');

WEBROOT = path.join(path.dirname(__filename), 'public');
    
var server = http.createServer(function(req, res) {
	console.log('started server');
	req.on('end', function() {
			var ip = req.connection.remoteAddress;
			  paperboy
			    .deliver(WEBROOT, req, res)
			    .addHeader('X-PaperRoute', 'Node')
			    .before(function() {
			      console.log('Received Request');
			    })
			    .after(function(statCode) {
				  console.log('in after callback')
			      log(statCode, req.url, ip);
			    })
			    .error(function(statCode, msg) {
			      res.writeHead(statCode, {'Content-Type': 'text/plain'});
			      res.end("Error " + statCode);
			      log(statCode, req.url, ip, msg);
			    })
			    .otherwise(function(err) {
			      res.writeHead(404, {'Content-Type': 'text/plain'});
			      res.end("Error 404: File not found");
			      log(404, req.url, ip, err);
			    });
	});
}).listen(7777, '127.0.0.1');

function log(statCode, url, ip, err) {
  var logStr = statCode + ' - ' + url + ' - ' + ip;
  if (err)
    logStr += ' - ' + err;
  console.log(logStr);
}
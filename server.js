// Require modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//array of minetypes

var minetypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css",
};

// create server
 http.createServer(function(req , res){
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(uri));
    console.log('loading' + uri);
    var stats;

    try {
      stats = fs.lstatSync(fileName);
    }
    catch(e)
    {
      res.writeHead(404, {'content-Type': 'text/plain'});
      res.write('404 not found\n');
      res.end();
      return;
    }

    //check if file/directory
    if(stats.isFile())
    {
      var minetype = minetypes[path.extname(fileName).split(".").reverse()[0]];
      res.writeHead(200, {"content-Type" : minetype});

      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);
    }
    else if (stats.isDirectory()) {
      res.writeHead(302,{
        'location' : 'index.html'
      });
      res.end();
    }
      else{
        res.writeHead(500, { 'content-Type' : 'text/plain'});
        res.write('500 internal error\n');
        res.end();
      }
 }).listen(3000);

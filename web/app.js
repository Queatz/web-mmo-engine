var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');

var app = express();

app.get('**', function(req, res, next) {
    var file = path.join(__dirname, req.url);

    try {
        fs.accessSync(file, fs.R_OK);
    } catch(e) {
        file = path.join(__dirname, 'index.html');
    }

    res.status(200).sendFile(file);
});

var server = http.createServer(app);

server.listen(80)

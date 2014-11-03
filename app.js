var port = process.env.PORT || 3000,
    ip = process.env.IP || "0.0.0.0",
    http = require("http"),
    fs = require("fs"),
    html = fs.readFileSync("index.html");

var express = require('express');
var app = express();

app.set('title', 'imgawsome');

app.get('/', function(req, res) {
    res.send(html);
});

app.post('/', function(req, res) {
    //do stuff that i've lost, so lets learn how to version control
});

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + ip + ":" + port + "/");

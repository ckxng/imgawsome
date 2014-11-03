var port = process.env.PORT || 3000,
    http = require("http"),
    fs = require("fs"),
    html = fs.readFileSync("index.html");
    
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send(html);
});

app.post('/', function(req, res){
 //do stuff that i've lost, so lets learn how to version control
});

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(3000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");

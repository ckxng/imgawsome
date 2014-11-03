var port = process.env.PORT || 3000,
    ip = process.env.IP || "0.0.0.0",
    http = require("http"),
    fs = require("fs"),
    html = fs.readFileSync("index.html");

var express = require('express');
var app = express();
var router = express.Router();

app.set('title', 'imgawsome');

/**
 * GET /
 * return the contents of index.html
 * end processing
 */
router.get('/', function(req, res, next) {
    res.status(200).send(html);
});

/**
 * POST /
 * do nothing
 */
router.post('/', function(req, res, next) {
    //do stuff that i've lost, so lets learn how to version control
    next();
});

app.use(router);

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + ip + ":" + port + "/");

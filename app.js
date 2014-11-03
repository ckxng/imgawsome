var port = process.env.PORT || 3000,
    ip = process.env.IP || "0.0.0.0",
    http = require("http"),
    fs = require("fs"),
    html = fs.readFileSync("index.html");

var express = require('express');
var app = express();
var router = express.Router();
var morgan = require('morgan');

app.set('title', 'imgawsome');

/**
 * GET /static
 * serve static files (should eventually move/mirror this to S3)
 * end processing
 */
app.use("/static", express.static(__dirname + "/static"));

/**
 * MIDDLEWARE logger
 * log all the middle ware BELOW this point (not statics)
 */
app.use(morgan('combined'));

/**
 * GET /
 * return the contents of index.html
 * end processing
 */
router.get('/', function(req, res, next) {
    res.set("Content-type", "text/html");
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

// listen on the IP and PORT specified by the environment.
// defaults to any interface, tcp port 3000
app.listen(port, ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + ip + ":" + port + "/");

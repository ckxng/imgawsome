var port = process.env.PORT || 3000;
var ip = process.env.IP || "0.0.0.0";
var http = require("http");
var fs = require("fs");

var express = require('express');
var app = express();
var router = express.Router();
var morgan = require('morgan');
var exphbs = require('express-handlebars');

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

// configure the default view engine to use handlebars
// "main.html" is the default layout
app.engine('.html', exphbs({
    defaultLayout: 'main',
    extname: '.html'
}));
app.set('view engine', '.html');

/**
 * PARAM :id
 * match first char a-z, A-Z, remaining chars a-z, A-Z, -, 0-9
 */
router.param('id', function(req, res, next, id) {
    if(id.match(/^[a-zA-Z][a-zA-Z\-0-9]*$/)) {
        req.params.id = id;
    }
    next();
});

/**
 * GET /
 * redirect to index page
 * end processing
 */
router.get('/', function(req, res, next) {
    res.redirect("/page/index");
});

/**
 * POST /
 * do nothing
 */
router.post('/', function(req, res, next) {
    //do stuff that i've lost, so lets learn how to version control
    next();
});

router.get('/page/:id', function(req, res, next) {
    res.render(req.params.id);
});

app.use(router);

// listen on the IP and PORT specified by the environment.
// defaults to any interface, tcp port 3000
app.listen(port, ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + ip + ":" + port + "/");

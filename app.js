var aws = require('aws-sdk');
var s3 = new aws.S3();
var config = require('./config/config.js');

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

/**
 * GET /page/:id
 * Get a templated page indicated by :id
 * end processing
 */
router.get('/page/:id', function(req, res, next) {
    res.render(req.params.id);
});

/**
 * GET /magic/puturl
 * Get a presigned URL that's valid for uploading ONE file within the next
 * 15 minutes.  Returned as JSON, no formatting.
 * {
 *   err: undefined || Error(), // set to Error object on failure
 *   url: "URL" // set to presigned URL on sucess, undefined on failure
 * }
 * end processing
 */
router.get('/magic/puturl', function(req, res, next) {
    var generateKey = function(prefix, length) {
        var key = "";
        var pool = "abcdefghijkmnopqrstuvwxyz";
        if(length--) {
            key += pool.charAt(Math.floor(Math.random()*pool.length));
        }
        
        pool = "abcdefghijkmnopqrstuvwxyz023456789";
        while(length--) {
            key += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        return prefix + key;
    };
    
    var params = {
        'Bucket': config.s3_bucket, 
        'Key': generateKey(config.s3_prefix, config.key_length)
    };
    s3.getSignedUrl('putObject', params, function(err, url) {
        res.set('Content-type', 'application/json');
        res.json({
            'err': err,
            'url': url
        });
    });
});

app.use(router);

// listen on the IP and PORT specified by the environment.
// defaults to any interface, tcp port 3000
app.listen(config.port, config.ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + config.ip + ":" + config.port + "/");

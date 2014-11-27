var aws = require('aws-sdk');
var s3 = new aws.S3();
var config = require('./config/config.js');

var express = require('express');
var app = express();
var router = express.Router();
var morgan = require('morgan');

/**
 * MIDDLEWARE logger
 * log all the middle ware BELOW this point (not statics)
 */
app.use(morgan('combined'));

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
        res.jsonp({
            'err': err,
            'url': url
        });
    });
});

app.use(router);

/**
 * GET / (default)
 * serve static files (should eventually move/mirror this to S3)
 * end processing
 */
app.use("/", express.static(__dirname + "/client"));

// listen on the IP and PORT specified by the environment.
// defaults to any interface, tcp port 3000
app.listen(config.port, config.ip);

// Put a friendly message on the terminal
console.log("Server running at http://" + config.ip + ":" + config.port + "/");

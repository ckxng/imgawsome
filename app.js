var aws = require('aws-sdk');
var s3 = new aws.S3();
var config = require('./config/config.js');
var awsutil = require('./lib/awsutil.js');

var express = require('express');
var app = express();
var router = express.Router();
var morgan = require('morgan');

/**
 * MIDDLEWARE logger
 * log all the middle ware BELOW this point (everything)
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
    var params = {
        'Bucket': config.s3_bucket, 
        'Key': awsutil.generateKey(config.s3_prefix, config.key_length)
    };
    s3.getSignedUrl('putObject', params, function(err, url) {
        res.jsonp({
            'err': err,
            'url': url
        });
    });
});

/**
 * GET /magic/formpostsig
 * Get a signed policy that's valid for uploading ONE file within the next
 * 15 minutes.  Returned as JSON, no formatting.
 * {
 *   policy: JSON, // set to policy on sucess
 *   base64: "base64", // set to base64 of policy on sucess
 *   signature: "base64" // set to signature on sucess
 * }
 * end processing
 */
router.get('/magic/formpostsig', function(req, res, next) {
    var policy = {
        'Statement': [{
            'Resource': awsutil.generateKey(config.s3_prefix, config.key_length),
            'Condition': {
                'DateLessThan': {
                    'AWS:EpochTime': (new Date().valueOf())+(60*15)
                },
            }
         }]
    };
    var policyString = JSON.stringify(policy);
    var policyBuffer = new Buffer(policyString);
    var policyBase64 = policyBuffer.toString("base64");
    
    var crypto = require('crypto');
    var signature = 
        crypto.createHmac("sha1", process.env.AWS_SECRET_ACCESS_KEY)
        .update(new Buffer(policyBase64))
        .digest("base64");
    
    res.jsonp({
        'policy': policy,
        'base64': policyBase64,
        'signature': signature
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

// Environment variables called directly by "aws-sdk"
// - AWS_ACCESS_KEY_ID
// - AWS_SECRET_ACCESS_KEY

// Either set the following values directly, or with environment using:
// module.exports.something = process.env.SOMETHING

module.exports.aws_region = 'us-west-2';
module.exports.s3_bucket = 'mybucket';
module.exports.s3_prefix = 'uploads/';
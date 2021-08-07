const aws = require('aws-sdk');
const fs = require("fs")


let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('../secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1'
});
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});



module.exports.sendEmail = (recipiants, message,subject) => {

    return ses.sendEmail({
        Source: '<cautious.tire@spicedling.email>',
        Destination: {
            ToAddresses: [recipiants]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        }})
        .promise()
        .then(() => console.log('it worked!'))
        .catch(err => console.log(err));
}

module.exports.upload = (req,res,next) => {
    if (!req.file) {
        return res.sendStatus(500); 
    }
    console.log("in ses.js req.file", req.file)
    const {filename, mimetype,size, path} = req.file;
        
    const promise = s3
    .putObject({
        Bucket: 'spicedling',
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
    .promise();

    promise.then(
        () => {
            // it worked!!!
            console.log("in s3.js: amazon upload completet!!");
            fs.unlink(path, () => {});
            next();
        }
    ).catch(
        err => {
            // uh oh
            console.log("err in putObj in s3.js",err);
        }
    );  
}
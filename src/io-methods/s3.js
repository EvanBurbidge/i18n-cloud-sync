const aws = require('aws-sdk');
const { config } = require('../config');
const { parseFilePathForS3 } = require('../utils');

if (config && config.region) {
  aws.config.update({ region: config.region });
}

const s3 = new aws.S3({
  apiVersion: '2006-03-01'
});

exports.readTranslations = filePath => new Promise((resolve, reject) => {
  let file = parseFilePathForS3(filePath);
  s3.getObject({
    Bucket: file.bucket,
    Key: file.key,
  }, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(data.Body.toString()));
    }
  })
});

exports.writeTranslations = (filePath, data) => new Promise(function(resolve, reject) {
  const file = parseFilePathForS3(filePath);
  s3.putObject({
    Bucket: file.bucket,
    Key: file.key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
    CacheControl: 'public, must-revalidate, max-age=0',
    ACL: 'public-read',
  }, function(err) {
    if (err)
      reject(err);
    else
      resolve();
  });
});

exports.writeNewTranslationsFile = (filePath, data) => new Promise(async (resolve, reject) => {
  const file = parseFilePathForS3(filePath);
  try {
    await s3.headObject({
      Bucket: file.bucket,
      Key: file.key,
    }).promise();
  } catch (e) {
    console.log('file does not exist');
  }
});

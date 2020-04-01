const { Storage } = require('@google-cloud/storage');
const { parseFilePathForGoogle } = require('../utils');

const storage = new Storage();

const readTranslations = filePath => {
  const file = parseFilePathForGoogle(filePath);
  return storage
    .bucket(file.bucketName)
    .file(file.fileName)
    .download()
    .then(d => JSON.parse(d.toString()));
};

const writeTranslations = (filePath, data) => {
  const file = parseFilePathForGoogle(filePath);
  return storage
    .bucket(file.bucketName)
    .file(file.fileName)
    .save(JSON.stringify(data), {
      contentType: 'application/json',
      metadata: {
        cacheControl: 'public, must-revalidate, max-age=0'
      }
    });
};

module.exports = {
  readTranslations,
  writeTranslations,
};

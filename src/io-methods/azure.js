const azure = require("azure-storage");
const dot = require('dotenv');

dot.config();

let blobService;
const getBlobService = () => {
  blobService = blobService || azure.createBlobService();
  return blobService;
};

const readTranslations = function(target) {
  const blobService = getBlobService();
  return new Promise(function(resolve, reject) {
    blobService.getBlobToText(target.azureContainer, target.azureBlob, function(
      error,
      response
    ) {
      if (error) return reject(error);
      return resolve(response);
    });
  });
};

const writeTranslations = function(target, content) {
  const blobService = getBlobService();
  return new Promise(function(resolve, reject) {
    blobService.createBlockBlobFromText(
      target.azureContainer,
      target.azureBlob,
      JSON.stringify(content),
      function(error, response) {
        if (error) reject(error);
        else resolve();
      }
    );
  });
};

module.exports = {
  readTranslations,
  writeTranslations,
};

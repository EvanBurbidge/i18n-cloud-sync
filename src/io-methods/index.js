const s3 = require('./s3');
const azure = require('./azure');
const google = require('./google-storage');

const { getConfig } = require('../config');
const { usesS3, usesGoogle, usesAzure, confirmAuth } = require('../utils');
const { updateConfigLocations, deleteConfigLocation } = require('./filesystem');


const { username, password } = confirmAuth(getConfig());


const getFilePath = lng => {
  const conf = getConfig();
  if (conf.locations[lng]) {
    return conf.locations[lng];
  }
  return '';
};

const readTranslations = async lng => {
  const filePath = getFilePath(lng);
  if (typeof filePath === 'object') {
    if (usesAzure(filePath)) {
      return await azure.readTranslations(filePath)
    }
  } else {
    if (usesGoogle(filePath)) {
      return await google.readTranslations(filePath);
    }
    if (usesS3(filePath)) {
      console.log(filePath);
      return await s3.readTranslations(filePath);
    }
  }
};

const writeTranslations = async (lng, data) => {
  const filePath = getFilePath(lng);
  if (typeof filePath === 'object') {
    if (usesAzure(filePath)) {
      return await azure.writeTranslations(filePath, data);
    }
  } else {
    if (filePath.length === 0) {
      throw Error('this location does not exist please add it to your locations');
    }
    if (usesGoogle(filePath)) {
      return await google.writeTranslations(filePath, data);
    }
    if (usesS3(filePath)) {
      return await s3.writeTranslations(filePath, data);
    }
  }
};

module.exports = {
  updateConfigLocations,
  deleteConfigLocation,
  writeTranslations,
  readTranslations,
  username,
  password,
};

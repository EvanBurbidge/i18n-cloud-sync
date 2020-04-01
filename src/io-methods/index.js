const _ = require('lodash');
const s3 = require('./s3');
const { config } = require('../config');
const { usesS3 } = require('../utils');
const { updateConfigLocations, deleteConfigLocation } = require('./filesystem');


const getFilePath = lng => {
  if (config.locations[lng]) {
    return config.locations[lng];
  }
  return '';
};

const readTranslations = async lng => {
  const filePath = getFilePath(lng);
  if (usesS3(filePath)) {
    return await s3.readTranslations(filePath);
  }
};

const writeTranslations = async (lng, data) => {
  const filePath = getFilePath(lng);
  if (filePath.length === 0) {
    throw Error('this location does not exist');
  }
  if (usesS3(filePath)) {
    return await s3.writeTranslations(filePath, data);
  }
};

module.exports = {
  updateConfigLocations,
  deleteConfigLocation,
  writeTranslations,
  readTranslations
}

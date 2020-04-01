const fs = require('fs');
const path = require('path');
const { config } = require('../config');

const getConfigFile = () => path.resolve(__dirname, '../..', 'config.json');

const updateConfigLocations = (key, value) => {
  const toWrite = JSON.stringify({
    ...config,
    locations: {
      ...config.locations,
      [key]: value,
    }
  });
  fs.writeFileSync(getConfigFile(), toWrite, 'utf8');
  return toWrite;
};


const deleteConfigLocation = location => {
  delete config.locations[location];
  fs.writeFileSync(getConfigFile(), JSON.stringify(config), 'utf8')
  return config;
};


module.exports = {
  updateConfigLocations,
  deleteConfigLocation,
};

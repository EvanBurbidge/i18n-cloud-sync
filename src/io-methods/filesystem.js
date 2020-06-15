const fs = require('fs');
const path = require('path');
const { config } = require('../config');

const getConfigFile = () => path.resolve(__dirname, '../..', 'config.json');

const updateConfigLocations = (key, value) => new Promise((resolve, reject) => {
  const toWrite = JSON.stringify({
    ...config,
    locations: {
      ...config.locations,
      [key]: value,
    }
  });
  fs.writeFile(getConfigFile(), toWrite, 'utf8', (err, data) => {
    delete toWrite.password;
    if(err) reject(err);
    resolve(JSON.parse(toWrite));
  });
});


const deleteConfigLocation = location => {
  delete config.locations[location];
  fs.writeFileSync(getConfigFile(), JSON.stringify(config), 'utf8')
  return config;
};


module.exports = {
  updateConfigLocations,
  deleteConfigLocation,
};

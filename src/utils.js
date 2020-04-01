const isDigitalOcean = file => file.startsWith('spaces://');

const getJsPath = filePath => filePath.substring(0, filePath.lastIndexOf('.')) + '.js';

const parseFilePathForS3 = (filePath) => {
  const prefix = isDigitalOcean(filePath) ? 'spaces://' : 's3://'
  const file = filePath.split(prefix)[1]
  const bucketDelimiter = isDigitalOcean(filePath) ? '.' : '/'
  const bucket = file.substr(0, file.indexOf(bucketDelimiter))
  const key = file.substr(file.indexOf('/') + 1)
  return {
    bucket,
    key,
  }
};

const parseFilePathForGoogle = filePath => {
  const regex = /^google:\/\/(.+)\/(.+)$/
  const [_, bucketName, fileName] = regex.exec(filePath)
  if (!bucketName || !fileName) {
    throw Error(`Invalid Google Cloud Storage url: ${filePath}`)
  }
  return {bucketName, fileName}
};

const confirmAuth = config => {
  if ( (typeof config.username === 'string' && typeof config.password === 'string')
    || (config.username === undefined && config.password === undefined) ) {
    return {
      username: config.username,
      password: config.password,
    }
  } else {
    throw new Error(`Invalid config file -- username and password should either be strings or missing completely`)
  }
};

const usesS3 = filePath => filePath.startsWith('spaces://') || filePath.startsWith('s3://');
const usesGoogle = filePath => filePath.startsWith('google://');


module.exports = {
  usesS3,
  usesGoogle,
  confirmAuth,
  parseFilePathForS3,
  parseFilePathForGoogle,
  getJsPath,
};

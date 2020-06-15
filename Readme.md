![i18n-cloud-sync-logo](http://cdn.i18ncore-api.com/i18n-logo.png)
# i18n-cloud-sync
i18n-cloud-sync is a simple node js project that provides a restful api for syncing translations, and their locations to the cloud. All work is done via restful api calls in order to update files and configurations. 

## Supported Providers
At the moment i18n-cloud-sync caters for

- AWS S3
- Google Cloud Storage
- Digital Ocean Spaces
- Azure

Future deployments will cater for Azure and other providers, and also for a filesystem based solution. 

## Why does this exist?
Companies may have a hard time with translations. Managing multiple projects, repos and translations means more work than is actually required just to get the right translations into place. With this you will be able to store your projects translations on the cloud and have them easily accessible for all. 

This project also means that you won’t be encountering anymore merging errors with your translations files, if two people publish at the same time then the endpoint is called twice to update the file twice. This will avoid any race conditions and the possibility of lost work. 

## Security
The i18n-cloud-sync must have read / write access to the CDN / bucket that is storing your translations. It exposes a web server that allows for modifying the state of your production application. It is password protected with HTTP basic authentication.

The following security constraints are highly recommended to secure the i18n-cloud-sync.
 
The i18n-cloud-sync’s web server is only exposed within your VPC.
Your CI runners should either be within the VPC or tunnel into it when calling the i18n-cloud-sync.
The i18n-cloud-sync has HTTP basic authentication enabled, and only the CI runners know the username and password.
## Example Usage
[This github repo](https://github.com/EvanBurbidge/i18n-cloud-sync-example) shows an example on how to use this project within your organization.
## Installation and usage

### Docker
i18n-cloud-sync is available on docker hub [ thewebuiguy/i18n-cloud-sync ] the image expects you to have a config.json setup. 

### Node
i18n-cloud-sync is available as an npm package
```npm install i18n-cloud-sync ```

or run it directly via
```npx i18n-cloud-sync config.json```
 

## Configuration File
i18n-cloud-sync expects a config.json file to be present in the application, this will allow you to password protect your projects in which you must
provide a username and password. Here are a list of properties you must provide for this project to be able to work.

- `region` - the region of aws that you are using if you are using aws.
- `locations` - this is an object of key value pairs which shows where your different translation files live.
- `username` - (OPTIONAL) the username that will be used by your CI in order to login via basic auth
- `password` - (OPTIONAL) the password that needs to be used by your CI in order to login via basic auth
- `s3Endpoint` - (OPTIONAL) used for digital ocean spaces.
- `port` - (OPTIONAL) allows you to spin the project up on another port.

### Config File Example

#### Option 1 JSON File
```json
{
    "username": "username",
    "password": "password",
    "region": "eu-west-1",
    "s3Endpoint": "http://mycdn.com",
    "locations": {
      "moduleOneEn": "s3://mycdn.com/en.json",
      "moduleOneDe": "s3://mycdn.com/de.json"
    }
}
```
#### Option 2 .js File
```javascript
module.exports = {
    "username": process.env.HTTP_USERNAME,
    "password": process.env.HTTP_PASSWORD,
    "region": "eu-west-1",
    "s3Endpoint": "http://mycdn.com",
    "locations": {
      "moduleOneEn": "s3://mycdn.com/en.json",
      "moduleOneDe": "s3://mycdn.com/de.json"
    }
}
```
** Note in order to do this you must change the start command in your docker file e.g. 
```
CMD ['npm', 'start', 'conf.js']
```

## Supported Provider Examples
### AWS
If your translations files file is hosted by AWS S3, you can use this project to modify the s by specifying in your config s3:// in the locations config object.

The format of the string is s3://bucket-name/file-name.json

i18n-cloud-sync relies on the  [AWS_DEFAULT_REGION environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) for authentication with S3.

config.json:
```json
{
  "region": "eu-west-1",
  "s3Endpoint": "https://mycdn.com",
  "locations": {
    "moduleOneEn": "s3://mycdn.com/en.json",  
    "moduleOneDe": "s3://mycdn.com/de.json"  
  }
}
```

### Digital Ocean Spaces
If your translations files are hosted on Digital Ocean Spaces, you can use the api to modify translations files by specifying in your config spaces:// in the locations config object.

The format of the string is spaces://bucket-name.digital-ocean-domain-stuff.com/file-name.json. Note that the name of the Bucket is everything after spaces:// and before the first . character.

Since the API Digital Ocean Spaces is compatible with the AWS S3 API, i18n-cloud-sync uses aws-sdk to communicate with Digital Ocean Spaces. As such, all options that can be passed for AWS S3 also are applied to Digital Ocean Spaces. You need to provide AWS CLI environment variables for authentication with Digital Ocean Spaces, since i18n-cloud-sync is using aws-sdk to communicate with Digital Ocean.

Instead of an AWS region, you should provide an s3Endpoint config value that points to a Digital Ocean region.

config.json:
```json
{
  "s3Endpoint": "https://nyc3.digitaloceanspaces.com",
  "locations": {
    "moduleOneEn": "spaces://mycdn.com/en.json",  
    "moduleOneDe": "spaces://mycdn.com/de.json"  
  }
}
```
### Google Cloud
Note that you must have the GOOGLE_APPLICATION_CREDENTIALS environment variable set for authentication.

config.json:
```json
{
  "locations": {
    "moduleOneEn": "google://bucketname/en.json",  
    "moduleOneDe": "spaces://mycdn.com/de.json"  
  }
}
```
### Azure Storage
Note, that you must have environment variables *AZURE_STORAGE_ACCOUNT* and *AZURE_STORAGE_ACCESS_KEY*, or *AZURE_STORAGE_CONNECTION_STRING* defined for authentication.

config.json:
```json
{
  "locations": {
    "azureEn": {
      "azureContainer": "i18ntranslationssync",
      "azureBlob": "en.json"
    }
  }
}
```

## Endpoints

GET `/health`
- will run a health check to see the server is running

GET `/locations`
- will return an overview of available locations
- `curl -i localhost:3000/locations`

GET `/<location>`
- will return the assets available at that location
- `curl -i localhost:3000/moduleOneEn -> {... some translations}`

POST `/update/<location>`
- must includes a translations object in the body
- will update the given location with data passed into it via the request body
- `curl -d { "translations": { "key": "translation" } } -X POST localhost:3000/update/moduleOneEn`

PUT `/update-config-locations`
- will update configuration locations in your config file
- `curl -d { "key": "moduleTwoEn", "value":"s3://mycdn.com/moduleTwoEn.json" } -X PUT localhost:3000/update-config-locations`

DELETE `delete-config-location/<location>`
- not to be used very often only when removing or deprecating old translations
- `curl -X DELETE localhost:3000/delete-config-location/moduleOneEn`

If username or password are set in your config these must be passed via basic auth.



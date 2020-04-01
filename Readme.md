# i18n-sync
I18n-sync is a simple node js project that provides a restful api for syncing translations, and their locations to the cloud. All work is done via restful api calls in order to update files and configurations. 

## Supported Providers
At the moment i18n-sync caters for

- AWS S3
- Google Cloud Storage
- Digital Ocean Spaces

Future deployments will cater for Azure and other providers, and also for a filesystem based solution. 

## Why does this exist?
Companies may have a hard time with translations. Managing multiple projects, repos and translations means more work than is actually required just to get the right translations into place. With this you will be able to store your projects translations on the cloud and have them easily accessible for all. 

This project also means that you won’t be encountering anymore merging errors with your translations files, if two people publish at the same time then the endpoint is called twice to update the file twice. This will avoid any race conditions and the possibility of lost work. 

## Security
The i18n-sync must have read / write access to the CDN / bucket that is storing your production import map. It exposes a web server that allows for modifying the state of your production application. It is password protected with HTTP basic authentication.

The following security constraints are highly recommended to secure the i18n-sync.
 
The i18n-sync’s web server is only exposed within your VPC.
Your CI runners should either be within the VPC or tunnel into it when calling the i18n-sync.
The i18n-sync has HTTP basic authentication enabled, and only the CI runners know the username and password.
## Example Usage
This github repo shows an example on how to use this project within your organization.
## Installation and usage

### Docker
i18n-sync is available on docker hub [ thewebuiguy/i18n-sync ] the image expects you to have a config.json setup. 

## Configuration File
i18n-sync expects a config.json file to be present in the application, this will allow you to password protect your projects in which you must
provide a username and password. Here are a list of properties you must provide for this project to be able to work.

- `region` - the region of aws that you are using if you are using aws.
- `locations` - this is an object of key value pairs which shows where your different translation files live.
- `username` - (OPTIONAL) the username that will be used by your CI in order to login via basic auth
- `password` - (OPTIONAL) the password that needs to be used by your CI in order to login via basic auth
- `s3Endpoint` - (OPTIONAL) used for digital ocean spaces and also for aws
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

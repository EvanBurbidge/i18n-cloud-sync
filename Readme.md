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

### Node
To run i18n-sync in Node, run the following command: npx @thewebuiguy/i18n-sync config.json

It is available as @thewebuiguy/i18n-sync on npm.

The default web server port is 5000. To run web server with a custom port, se the PORT ENV variable.

$ PORT=8080 npx import-map-deployer config.json


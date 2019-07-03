# Google Tag Manager Templates Library
[![Build Status](https://travis-ci.org/sahava/GoogleTagManagerTemplates_site.svg?branch=master)](https://travis-ci.org/sahava/GoogleTagManagerTemplates_site)

gtm templates dot com website

# Installation

1. Clone repo
2. Create folder `secret` in project root
3. Create a new JSON key for the `App Engine default service account` at https://console.cloud.google.com/iam-admin/serviceaccounts?project=gtm-templates-com, and download it as `client-secrets.json`, store it in the `secret` folder
4. Run `export GOOGLE_APPLICATION_CREDENTIALS=secret/client-secrets.json`
4.1 on Windows Run `set GOOGLE_APPLICATION_CREDENTIALS=secret/client-secrets.json`
5. Install `grunt` with `npm install -g grunt-cli`
6. Run app with watchers using `grunt`
7. Browse to `localhost:8080`

# Tests

All tests: `npm test`

Unit tests: `npm run test:unit`

Integration tests: `npm run test:integration`

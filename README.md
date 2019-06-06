# Google Tag Manager Templates Library
[![Build Status](https://travis-ci.com/thyngster/gtmtemplates_com.svg?token=xxmVdtxvbfFcJjMsgYbV&branch=master)](https://travis-ci.com/thyngster/gtmtemplates_com)

gtm templates dot com website

# Installation

1. Clone repo
2. Create folder `secret` in project root
3. Create a new JSON key for the `App Engine default service account` at https://console.cloud.google.com/iam-admin/serviceaccounts?project=gtm-templates-com, and download it as `client-secrets.json`, store it in the `secret` folder
4. Run `export GOOGLE_APPLICATION_CREDENTIALS=secret/client-secrets.json`
4.1 on Windows Run `set GOOGLE_APPLICATION_CREDENTIALS=secret/client-secrets.json`
5. Run app with `npm start`
6. Browse to `localhost:8080`

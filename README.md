# Borica package

## Requirements

Register the following env variables in `process.env` recommened use of [dotenv](https://www.npmjs.com/package/dotenv) package

|Variable| Value|
|:-:|---|
|`BORICA_DEBUG_MODE`|`true` or `false` gets the *_TEST* keys or not  |
|`BORICA_TERMINAL_ID`|number of terminal ex. `17361475`|
|`BORICA_PRIVATE_KEY`|`-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQC6D...` with \n after every line|
|`BORICA_PRIVATE_KEY_TEST`|`-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQC6D...` with \n after every line|
|`BORICA_PUBLIC_KEY`|`-----BEGIN CERTIFICATE-----\nMIIEPjCCAyagAw` with \n after every line|
|`BORICA_PUBLIC_KEY_TEST`|`-----BEGIN CERTIFICATE-----\nMIIEPjCCAyagAw` with \n after every line|

## Usage
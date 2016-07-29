# akshaycj47-image-encryption

# Features
* Encrypt image using Crypto
* Decrypt image using Crypto

## Install
```bash
$ npm install @akshaycj47/akshaycj47-image-encryption
```

## Usage
```Javascript
const ImageEncryption = require('@akshaycj47/akshaycj47-image-encryption');
```

### 1. Encrypt image
```Javascript
const ImageEncryption = require('@akshaycj47/akshaycj47-image-encryption');

const params = {
    inputFilePath = 'STRING_VALUE',
    outputFilePath = 'STRING_VALUE'
};
ImageEncryption.encryptImage(params, (err, res) => {

    if (!err) {
        // Image encrypted and stored successfully
        // res contains 
    }
});
```

### 2. Decrypt image
```Javascript
const ImageEncryption = require('@akshaycj47/akshaycj47-image-encryption');

const params = {
    inputFilePath = 'STRING_VALUE',
    outputFilePath = 'STRING_VALUE'
};
ImageEncryption.decryptImage(params, (err, res) => {

    if (!err) {
        // Image decrypted and stored successfully
        // res contains 
    }
});
```
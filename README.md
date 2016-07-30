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
    inputPath = 'STRING_VALUE',
    outputPath = 'STRING_VALUE'
};
ImageEncryption.encryptImage(params, (err, res) => {

    if (!err) {
        // Image encrypted and stored successfully
        // res contains id ('STRING_VALUE') which is the output file path,
        // encrypted buffer ('STRING_VALUE'), and ecrypted data key
        // ('STRING_VALUE')
    }
});
```

### 2. Decrypt image
```Javascript
const ImageEncryption = require('@akshaycj47/akshaycj47-image-encryption');

const params = {
    inputPath = 'STRING_VALUE',
    outputPath = 'STRING_VALUE'
};
ImageEncryption.decryptImage(params, (err, res) => {

    if (!err) {
        // Image decrypted and stored successfully
        // res contains encrypted buffer ('STRING_VALUE'), and 
        // encrypted data key ('STRING_VALUE')
    }
});
```
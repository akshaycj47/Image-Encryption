'use strict';

const Fs = require('fs');
const Path = require('path');
const Crypto = require('crypto');
const Async = require('async');
const Store = require('json-fs-store')('.');

const Nconf = require('nconf');
Nconf.file({ file: Path.join(__dirname, '../config.json') });

const algorithm = 'aes-256-cbc';
const internals = {};

internals.encryptBuffer = (buffer, dataKey) => {

    const cipher = Crypto.createCipher(algorithm, dataKey);
    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
};

internals.decryptBuffer = (buffer, dataKey) => {

    const decipher = Crypto.createDecipher(algorithm, dataKey);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
};

module.exports = {

    /**
     * Encrypt an image
     * @param {object} params - The params object
     * @param {string} params.inputPath - Path of the image to be encrypted
     * @param {string} params.outputPath - Path of encrypted image
     * @param {function} callback - Two param err, result callback
     * If present, result will be
     */
    encryptImage: (params, callback) => {

        let inputBuff = '';
        let encBuff = '';
        let dataKey = '';
        let encDataKey = '';
        const retVal = {};
        Async.series([

            (next) => {

                // Check whether the file exists or not
                // If it exists, convert it to buffer
                try {
                    inputBuff = Fs.readFileSync(params.inputPath);
                    retVal.id = params.outputPath;
                    next();
                }
                catch (err) {
                    return callback(err);
                }
            },
            (next) => {

                // Generate data key using crypto
                try {
                    //dataKey = Crypto.randomBytes(256).toString();
                    dataKey = Crypto.randomBytes(256).toString();
                    next();
                }
                catch (err) {
                    return callback(err);
                }
            },
            (next) => {

                // Encrypt image buffer using data key and crypto
                try {
                    encBuff = internals.encryptBuffer(inputBuff, dataKey);
                    retVal.encBuff = encBuff.toString('hex');
                    next();
                }
                catch (err) {
                    return callback(err);
                }
            },
            (next) => {

                // Encrypt data key using master key and crypto
                try {
                    encDataKey = internals.encryptBuffer(dataKey, Nconf.get('masterKey'));
                    retVal.encDataKey = encDataKey.toString('hex');
                    next();
                }
                catch (err) {
                    return callback(err);
                }
            },
            (next) => {

                // Store the encrypted buffer
                Store.add(retVal, (err) => {

                    if (err) {
                        return callback(err);
                    }
                    callback(null, retVal);
                });
            }
        ]);
    },

    /**
     * Decrypt an image
     * @param {object} params - The params object
     * @param {string} params.inputPath - Path of the image to be decrypted
     * @param {string} params.outputPath - Path of decrypted image
     * @param {function} callback - Two param err, result callback
     * If present, result will be
     */
    decryptImage: (params, callback) => {

        let encObj = '';
        let decDataKey = '';
        let decBuff = '';
        Async.series([

            (next) => {

                // Retrieve an object from json fs store
                Store.load(params.inputPath, (err, res) => {

                    if (err) {
                        return callback(err);
                    }
                    encObj = res;
                    next();
                });
            },
            (next) => {

                // Decrypt data key using master key and crypto
                try {
                    decDataKey = internals.decryptBuffer(new Buffer(encObj.encDataKey, 'hex'), Nconf.get('masterKey'));
                    next();
                }
                catch (err) {
                    console.log('Returning error: ', err);
                    return callback(err);
                }
            },
            (next) => {

                // Decrypt image using data key and crypto
                try {
                    decBuff = internals.decryptBuffer(new Buffer(encObj.encBuff, 'hex'), decDataKey);
                    next();
                }
                catch (err) {
                    return callback(err);
                }
            },
            (next) => {

                // Store image
                try {
                    Fs.writeFileSync(params.outputPath, decBuff);
                    callback(null, null);
                }
                catch (err) {
                    return callback(err);
                }
            }
        ]);
    }
};

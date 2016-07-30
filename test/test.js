'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const before = lab.before;
//const after = lab.after;
const it = lab.it;
const expect = Code.expect;
//const Fs = require('fs');
const Async = require('async');

const ImageEncryption = require('../lib/index');

describe('test image encryption', () => {

    describe('encryptImage(params, callback)', () => {

        describe('succeeds', () => {

            it('encrypts single valid image file', (done) => {

                const params = {
                    inputPath: './images_regular/image1.jpg',
                    outputPath: './images_encrypted/image1.enc.jpg'
                };
                ImageEncryption.encryptImage(params, (err, res) => {

                    expect(err).not.to.exist();
                    expect(res).to.exist();
                    expect(res.id).equals(params.outputPath);
                    expect(res.encBuff).to.exist();
                    expect(res.encDataKey).to.exist();
                    done();
                });
            });
        });
        describe('fails', () => {

        });
    });
    describe('decryptImage(params, callback)', () => {

        const testData = {};
        before((done) => {

            Async.series([

                (next) => {

                    // Encrypt a single valid image
                    const params = {
                        inputPath: './images_regular/image1.jpg',
                        outputPath: './images_encrypted/image1.enc.jpg'
                    };
                    ImageEncryption.encryptImage(params, (err, res) => {

                        if (!err) {
                            testData.encDataKey = res.encDataKey;
                            testData.encBuff = res.encBuff;
                            done();
                        }
                    });
                }
            ]);
        });

        describe('succeeds', () => {

            it('decrypts single valid image file', (done) => {

                const params = {
                    inputPath: './images_encrypted/image1.enc.jpg',
                    outputPath: './images_regular/image1.dec.jpg'
                };
                ImageEncryption.decryptImage(params, (err, res) => {

                    expect(err).not.to.exist();

                    //expect(err).to.exist();
                    done();
                });
            });
        });
        describe('fails', () => {

        });
    });
});

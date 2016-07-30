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

            it('does not encrypt when input file is invalid', (done) => {

                const params = {
                    inputPath: './incorrect_directory/image1.jpg',
                    outputPath: './images_encrypted/image1.enc.jpg'
                };
                ImageEncryption.encryptImage(params, (err, res) => {

                    expect(res).not.to.exist();
                    expect(err).to.exist();
                    expect(err.message).equals('ENOENT: no such file or directory');
                    expect(err.code).equals('notFound');
                    done();
                });
            });
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
                    expect(res).to.exist();
                    expect(res.encDataKey).equals(testData.encDataKey);
                    expect(res.encBuff).equals(testData.encBuff);
                    done();
                });
            });
        });
        describe('fails', () => {

            it('does not decrypt when input path is invalid', (done) => {

                const params = {
                    inputPath: './images_decrypted/image1.enc.jpg',
                    outputPath: './images_regular/image1.dec.jpg'
                };
                ImageEncryption.decryptImage(params, (err, res) => {

                    expect(res).not.to.exist();
                    expect(err).to.exist();
                    expect(err.message).equals('ENOENT: no such file or directory');
                    expect(err.code).equals('notFound');
                    done();
                });
            });
            it('does not decrypt when output path is invalid', (done) => {

                const params = {
                    inputPath: './images_encrypted/image1.enc.jpg',
                    outputPath: './incorrect_directory/image1.dec.jpg'
                };
                ImageEncryption.decryptImage(params, (err, res) => {

                    expect(res).not.to.exist();
                    expect(err).to.exist();
                    expect(err.message).equals('ENOENT: no such file or directory');
                    expect(err.code).equals('notFound');
                    done();
                });
            });
        });
    });
});

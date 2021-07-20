// Creds: https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
const crypto = require('crypto');
const config = require('../config');

const algorithm = 'aes-256-ctr';
const secret= config.encryption.key;

const encrypt = (text) => {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, secret, iv);
    let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {
    let decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(hash.iv, 'hex'));
    let decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const base64enc = (plain) => {
    const buff = Buffer.from(plain, 'utf-8');
    const base64 = buff.toString('base64');
    return base64;
}

const base64dec = (plain) => {
    let buff = Buffer.from(plain, 'base64');
    return buff.toString();
}

module.exports = {
    encrypt,
    decrypt,
    base64enc,
    base64dec
};
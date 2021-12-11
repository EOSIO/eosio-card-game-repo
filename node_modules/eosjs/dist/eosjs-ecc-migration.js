"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecc = void 0;
var eosjs_jssig_1 = require("./eosjs-jssig");
var eosjs_key_conversions_1 = require("./eosjs-key-conversions");
var eosjs_numeric_1 = require("./eosjs-numeric");
exports.ecc = {
    initialize: function () { return console.error('Method deprecated'); },
    unsafeRandomKey: function () { return console.error('Method deprecated'); },
    randomKey: function (cpuEntropyBits, options) {
        if (options === void 0) { options = {}; }
        if (cpuEntropyBits !== undefined) {
            console.warn('Argument `cpuEntropyBits` is deprecated, ' +
                'use the options argument instead');
        }
        var privateKey = eosjs_key_conversions_1.generateKeyPair(eosjs_numeric_1.KeyType.k1, options).privateKey;
        return Promise.resolve(privateKey.toLegacyString());
    },
    seedPrivate: function () { return console.error('Method deprecated'); },
    privateToPublic: function (key, pubkey_prefix) {
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }
        var privateKey = eosjs_jssig_1.PrivateKey.fromString(key);
        var publicKey = privateKey.getPublicKey();
        return publicKey.toLegacyString();
    },
    isValidPublic: function (pubkey, pubkey_prefix) {
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }
        try {
            var publicKey = eosjs_jssig_1.PublicKey.fromString(pubkey);
            return publicKey.isValid();
        }
        catch (_a) {
            return false;
        }
    },
    isValidPrivate: function (wif) {
        try {
            var privateKey = eosjs_jssig_1.PrivateKey.fromString(wif);
            return privateKey.isValid();
        }
        catch (_a) {
            return false;
        }
    },
    sign: function (data, privateKey, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var privKey = typeof privateKey === 'string' ? eosjs_jssig_1.PrivateKey.fromString(privateKey) : privateKey;
        var signature = privKey.sign(data, true, encoding);
        return signature.toString();
    },
    signHash: function (dataSha256, privateKey, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        var privKey = typeof privateKey === 'string' ? eosjs_jssig_1.PrivateKey.fromString(privateKey) : privateKey;
        var signature = privKey.sign(dataSha256, false, encoding);
        return signature.toString();
    },
    verify: function (signature, data, pubKey, encoding, hashData) {
        if (encoding === void 0) { encoding = 'utf8'; }
        if (hashData === void 0) { hashData = true; }
        var publicKey = typeof pubKey === 'string' ? eosjs_jssig_1.PublicKey.fromString(pubKey) : pubKey;
        var sig = eosjs_jssig_1.Signature.fromString(signature);
        return sig.verify(data, publicKey, hashData, encoding);
    },
    recover: function (signature, data, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var sig = eosjs_jssig_1.Signature.fromString(signature);
        var publicKey = sig.recover(data, true, encoding);
        return publicKey.toLegacyString();
    },
    recoverHash: function (signature, dataSha256, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        var sig = eosjs_jssig_1.Signature.fromString(signature);
        var publicKey = sig.recover(dataSha256, false, encoding);
        return publicKey.toLegacyString();
    },
    sha256: function (data, resultEncoding, encoding) {
        if (encoding !== undefined) {
            console.warn('Argument `encoding` is deprecated');
        }
        if (resultEncoding !== undefined) {
            console.warn('Argument `resultEncoding` is deprecated');
        }
        return require('./eosjs-key-conversions').sha256(data);
    }
};
//# sourceMappingURL=eosjs-ecc-migration.js.map
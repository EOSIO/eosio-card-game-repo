"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
var eosjs_numeric_1 = require("./eosjs-numeric");
var eosjs_key_conversions_1 = require("./eosjs-key-conversions");
/** Represents/stores a private key and provides easy conversion for use with `elliptic` lib */
var PrivateKey = /** @class */ (function () {
    function PrivateKey(key, ec) {
        this.key = key;
        this.ec = ec;
    }
    /** Instantiate private key from an `elliptic`-format private key */
    PrivateKey.fromElliptic = function (privKey, keyType, ec) {
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(keyType);
        }
        return new PrivateKey({
            type: keyType,
            data: privKey.getPrivate().toArrayLike(Buffer, 'be', 32),
        }, ec);
    };
    /** Instantiate private key from an EOSIO-format private key */
    PrivateKey.fromString = function (keyString, ec) {
        var privateKey = eosjs_numeric_1.stringToPrivateKey(keyString);
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(privateKey.type);
        }
        return new PrivateKey(privateKey, ec);
    };
    /** Export private key as `elliptic`-format private key */
    PrivateKey.prototype.toElliptic = function () {
        return this.ec.keyFromPrivate(this.key.data);
    };
    PrivateKey.prototype.toLegacyString = function () {
        return eosjs_numeric_1.privateKeyToLegacyString(this.key);
    };
    /** Export private key as EOSIO-format private key */
    PrivateKey.prototype.toString = function () {
        return eosjs_numeric_1.privateKeyToString(this.key);
    };
    /** Get key type from key */
    PrivateKey.prototype.getType = function () {
        return this.key.type;
    };
    /** Retrieve the public key from a private key */
    PrivateKey.prototype.getPublicKey = function () {
        var ellipticPrivateKey = this.toElliptic();
        return eosjs_key_conversions_1.PublicKey.fromElliptic(ellipticPrivateKey, this.getType(), this.ec);
    };
    /** Sign a message or hashed message digest with private key */
    PrivateKey.prototype.sign = function (data, shouldHash, encoding) {
        var _this = this;
        if (shouldHash === void 0) { shouldHash = true; }
        if (encoding === void 0) { encoding = 'utf8'; }
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        var tries = 0;
        var signature;
        var isCanonical = function (sigData) {
            return !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
                && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));
        };
        var constructSignature = function (options) {
            var ellipticPrivateKey = _this.toElliptic();
            var ellipticSignature = ellipticPrivateKey.sign(data, options);
            return eosjs_key_conversions_1.Signature.fromElliptic(ellipticSignature, _this.getType(), _this.ec);
        };
        if (this.key.type === eosjs_numeric_1.KeyType.k1) {
            do {
                signature = constructSignature({ canonical: true, pers: [++tries] });
            } while (!isCanonical(signature.toBinary()));
        }
        else {
            signature = constructSignature({ canonical: true });
        }
        return signature;
    };
    /** Validate a private key */
    PrivateKey.prototype.isValid = function () {
        try {
            var ellipticPrivateKey = this.toElliptic();
            var validationObj = ellipticPrivateKey.validate();
            return validationObj.result;
        }
        catch (_a) {
            return false;
        }
    };
    return PrivateKey;
}());
exports.PrivateKey = PrivateKey;
//# sourceMappingURL=PrivateKey.js.map
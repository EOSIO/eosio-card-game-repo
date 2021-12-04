"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
var eosjs_numeric_1 = require("./eosjs-numeric");
var eosjs_key_conversions_1 = require("./eosjs-key-conversions");
/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
var PublicKey = /** @class */ (function () {
    function PublicKey(key, ec) {
        this.key = key;
        this.ec = ec;
    }
    /** Instantiate public key from an EOSIO-format public key */
    PublicKey.fromString = function (publicKeyStr, ec) {
        var key = eosjs_numeric_1.stringToPublicKey(publicKeyStr);
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(key.type);
        }
        return new PublicKey(key, ec);
    };
    /** Instantiate public key from an `elliptic`-format public key */
    PublicKey.fromElliptic = function (publicKey, keyType, ec) {
        var x = publicKey.getPublic().getX().toArray('be', 32);
        var y = publicKey.getPublic().getY().toArray('be', 32);
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(keyType);
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        }, ec);
    };
    /** Export public key as EOSIO-format public key */
    PublicKey.prototype.toString = function () {
        return eosjs_numeric_1.publicKeyToString(this.key);
    };
    /** Export public key as Legacy EOSIO-format public key */
    PublicKey.prototype.toLegacyString = function () {
        return eosjs_numeric_1.publicKeyToLegacyString(this.key);
    };
    /** Export public key as `elliptic`-format public key */
    PublicKey.prototype.toElliptic = function () {
        return this.ec.keyPair({
            pub: Buffer.from(this.key.data),
        });
    };
    /** Get key type from key */
    PublicKey.prototype.getType = function () {
        return this.key.type;
    };
    /** Validate a public key */
    PublicKey.prototype.isValid = function () {
        try {
            var ellipticPublicKey = this.toElliptic();
            var validationObj = ellipticPublicKey.validate();
            return validationObj.result;
        }
        catch (_a) {
            return false;
        }
    };
    return PublicKey;
}());
exports.PublicKey = PublicKey;
//# sourceMappingURL=PublicKey.js.map
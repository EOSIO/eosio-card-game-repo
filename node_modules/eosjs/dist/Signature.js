"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
var BN = require("bn.js");
var eosjs_numeric_1 = require("./eosjs-numeric");
var eosjs_key_conversions_1 = require("./eosjs-key-conversions");
/** Represents/stores a Signature and provides easy conversion for use with `elliptic` lib */
var Signature = /** @class */ (function () {
    function Signature(signature, ec) {
        this.signature = signature;
        this.ec = ec;
    }
    /** Instantiate Signature from an EOSIO-format Signature */
    Signature.fromString = function (sig, ec) {
        var signature = eosjs_numeric_1.stringToSignature(sig);
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(signature.type);
        }
        return new Signature(signature, ec);
    };
    /** Instantiate Signature from an `elliptic`-format Signature */
    Signature.fromElliptic = function (ellipticSig, keyType, ec) {
        var r = ellipticSig.r.toArray('be', 32);
        var s = ellipticSig.s.toArray('be', 32);
        var eosioRecoveryParam;
        if (keyType === eosjs_numeric_1.KeyType.k1 || keyType === eosjs_numeric_1.KeyType.r1) {
            eosioRecoveryParam = ellipticSig.recoveryParam + 27;
            if (ellipticSig.recoveryParam <= 3) {
                eosioRecoveryParam += 4;
            }
        }
        else if (keyType === eosjs_numeric_1.KeyType.wa) {
            eosioRecoveryParam = ellipticSig.recoveryParam;
        }
        var sigData = new Uint8Array([eosioRecoveryParam].concat(r, s));
        if (!ec) {
            ec = eosjs_key_conversions_1.constructElliptic(keyType);
        }
        return new Signature({
            type: keyType,
            data: sigData,
        }, ec);
    };
    /** Export Signature as `elliptic`-format Signature
     * NOTE: This isn't an actual elliptic-format Signature, as ec.Signature is not exported by the library.
     * That's also why the return type is `any`.  We're *actually* returning an object with the 3 params
     * not an ec.Signature.
     * Further NOTE: @types/elliptic shows ec.Signature as exported; it is *not*.  Hence the `any`.
     */
    Signature.prototype.toElliptic = function () {
        var lengthOfR = 32;
        var lengthOfS = 32;
        var r = new BN(this.signature.data.slice(1, lengthOfR + 1));
        var s = new BN(this.signature.data.slice(lengthOfR + 1, lengthOfR + lengthOfS + 1));
        var ellipticRecoveryBitField;
        if (this.signature.type === eosjs_numeric_1.KeyType.k1 || this.signature.type === eosjs_numeric_1.KeyType.r1) {
            ellipticRecoveryBitField = this.signature.data[0] - 27;
            if (ellipticRecoveryBitField > 3) {
                ellipticRecoveryBitField -= 4;
            }
        }
        else if (this.signature.type === eosjs_numeric_1.KeyType.wa) {
            ellipticRecoveryBitField = this.signature.data[0];
        }
        var recoveryParam = ellipticRecoveryBitField & 3;
        return { r: r, s: s, recoveryParam: recoveryParam };
    };
    /** Export Signature as EOSIO-format Signature */
    Signature.prototype.toString = function () {
        return eosjs_numeric_1.signatureToString(this.signature);
    };
    /** Export Signature in binary format */
    Signature.prototype.toBinary = function () {
        return this.signature.data;
    };
    /** Get key type from signature */
    Signature.prototype.getType = function () {
        return this.signature.type;
    };
    /** Verify a signature with a message or hashed message digest and public key */
    Signature.prototype.verify = function (data, publicKey, shouldHash, encoding) {
        if (shouldHash === void 0) { shouldHash = true; }
        if (encoding === void 0) { encoding = 'utf8'; }
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        var ellipticSignature = this.toElliptic();
        var ellipticPublicKey = publicKey.toElliptic();
        return this.ec.verify(data, ellipticSignature, ellipticPublicKey, encoding);
    };
    /** Recover a public key from a message or hashed message digest and signature */
    Signature.prototype.recover = function (data, shouldHash, encoding) {
        if (shouldHash === void 0) { shouldHash = true; }
        if (encoding === void 0) { encoding = 'utf8'; }
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        var ellipticSignature = this.toElliptic();
        var recoveredPublicKey = this.ec.recoverPubKey(data, ellipticSignature, ellipticSignature.recoveryParam, encoding);
        var ellipticKPub = this.ec.keyFromPublic(recoveredPublicKey);
        return eosjs_key_conversions_1.PublicKey.fromElliptic(ellipticKPub, this.getType(), this.ec);
    };
    return Signature;
}());
exports.Signature = Signature;
//# sourceMappingURL=Signature.js.map
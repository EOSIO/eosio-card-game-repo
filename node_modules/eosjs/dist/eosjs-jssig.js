"use strict";
/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsSignatureProvider = exports.digestFromSerializedData = exports.Signature = exports.PublicKey = exports.PrivateKey = void 0;
var elliptic_1 = require("elliptic");
var eosjs_key_conversions_1 = require("./eosjs-key-conversions");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return eosjs_key_conversions_1.PrivateKey; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return eosjs_key_conversions_1.PublicKey; } });
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return eosjs_key_conversions_1.Signature; } });
var eosjs_numeric_1 = require("./eosjs-numeric");
/** expensive to construct; so we do it once and reuse it */
var defaultEc = new elliptic_1.ec('secp256k1');
/** Construct the digest from transaction details */
var digestFromSerializedData = function (chainId, serializedTransaction, serializedContextFreeData, e) {
    if (e === void 0) { e = defaultEc; }
    var signBuf = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(serializedTransaction),
        Buffer.from(serializedContextFreeData ?
            new Uint8Array(e.hash().update(serializedContextFreeData).digest()) :
            new Uint8Array(32)),
    ]);
    return e.hash().update(signBuf).digest();
};
exports.digestFromSerializedData = digestFromSerializedData;
/** Signs transactions using in-process private keys */
var JsSignatureProvider = /** @class */ (function () {
    /** @param privateKeys private keys to sign with */
    function JsSignatureProvider(privateKeys) {
        var e_1, _a;
        /** map public to private keys */
        this.keys = new Map();
        /** public keys */
        this.availableKeys = [];
        try {
            for (var privateKeys_1 = __values(privateKeys), privateKeys_1_1 = privateKeys_1.next(); !privateKeys_1_1.done; privateKeys_1_1 = privateKeys_1.next()) {
                var k = privateKeys_1_1.value;
                var priv = eosjs_key_conversions_1.PrivateKey.fromString(k);
                var privElliptic = priv.toElliptic();
                var pubStr = priv.getPublicKey().toString();
                this.keys.set(pubStr, privElliptic);
                this.availableKeys.push(pubStr);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (privateKeys_1_1 && !privateKeys_1_1.done && (_a = privateKeys_1.return)) _a.call(privateKeys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    JsSignatureProvider.prototype.getAvailableKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.availableKeys];
            });
        });
    };
    /** Sign a transaction */
    JsSignatureProvider.prototype.sign = function (_a) {
        var chainId = _a.chainId, requiredKeys = _a.requiredKeys, serializedTransaction = _a.serializedTransaction, serializedContextFreeData = _a.serializedContextFreeData;
        return __awaiter(this, void 0, void 0, function () {
            var digest, signatures, requiredKeys_1, requiredKeys_1_1, key, publicKey, ellipticPrivateKey, privateKey, signature;
            var e_2, _b;
            return __generator(this, function (_c) {
                digest = digestFromSerializedData(chainId, serializedTransaction, serializedContextFreeData, defaultEc);
                signatures = [];
                try {
                    for (requiredKeys_1 = __values(requiredKeys), requiredKeys_1_1 = requiredKeys_1.next(); !requiredKeys_1_1.done; requiredKeys_1_1 = requiredKeys_1.next()) {
                        key = requiredKeys_1_1.value;
                        publicKey = eosjs_key_conversions_1.PublicKey.fromString(key);
                        ellipticPrivateKey = this.keys.get(eosjs_numeric_1.convertLegacyPublicKey(key));
                        privateKey = eosjs_key_conversions_1.PrivateKey.fromElliptic(ellipticPrivateKey, publicKey.getType());
                        signature = privateKey.sign(digest, false);
                        signatures.push(signature.toString());
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (requiredKeys_1_1 && !requiredKeys_1_1.done && (_b = requiredKeys_1.return)) _b.call(requiredKeys_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return [2 /*return*/, { signatures: signatures, serializedTransaction: serializedTransaction, serializedContextFreeData: serializedContextFreeData }];
            });
        });
    };
    return JsSignatureProvider;
}());
exports.JsSignatureProvider = JsSignatureProvider;
//# sourceMappingURL=eosjs-jssig.js.map
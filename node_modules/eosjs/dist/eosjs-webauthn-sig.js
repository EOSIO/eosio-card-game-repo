"use strict";
/**
 * @module WebAuthn-Sig
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
exports.WebAuthnSignatureProvider = void 0;
var ser = require("./eosjs-serialize");
var numeric = require("./eosjs-numeric");
var elliptic_1 = require("elliptic");
/** Signs transactions using WebAuthn */
var WebAuthnSignatureProvider = /** @class */ (function () {
    function WebAuthnSignatureProvider() {
        /** Map public key to credential ID (hex). User must populate this. */
        this.keys = new Map();
    }
    /** Public keys that the `SignatureProvider` holds */
    WebAuthnSignatureProvider.prototype.getAvailableKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.keys.keys())];
            });
        });
    };
    /** Sign a transaction */
    WebAuthnSignatureProvider.prototype.sign = function (_a) {
        var chainId = _a.chainId, requiredKeys = _a.requiredKeys, serializedTransaction = _a.serializedTransaction, serializedContextFreeData = _a.serializedContextFreeData;
        return __awaiter(this, void 0, void 0, function () {
            var signBuf, _b, _c, _d, digest, _e, signatures, requiredKeys_1, requiredKeys_1_1, key, id, assertion, e, pubKey, fixup, der, r, s, whatItReallySigned, _f, _g, _h, hash_1, _j, recid, sigData, sig, e_1_1;
            var e_1, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        signBuf = new ser.SerialBuffer();
                        signBuf.pushArray(ser.hexToUint8Array(chainId));
                        signBuf.pushArray(serializedTransaction);
                        if (!serializedContextFreeData) return [3 /*break*/, 2];
                        _c = (_b = signBuf).pushArray;
                        _d = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', serializedContextFreeData.buffer)];
                    case 1:
                        _c.apply(_b, [new (_d.apply(Uint8Array, [void 0, _l.sent()]))()]);
                        return [3 /*break*/, 3];
                    case 2:
                        signBuf.pushArray(new Uint8Array(32));
                        _l.label = 3;
                    case 3:
                        _e = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', signBuf.asUint8Array().slice().buffer)];
                    case 4:
                        digest = new (_e.apply(Uint8Array, [void 0, _l.sent()]))();
                        signatures = [];
                        _l.label = 5;
                    case 5:
                        _l.trys.push([5, 12, 13, 14]);
                        requiredKeys_1 = __values(requiredKeys), requiredKeys_1_1 = requiredKeys_1.next();
                        _l.label = 6;
                    case 6:
                        if (!!requiredKeys_1_1.done) return [3 /*break*/, 11];
                        key = requiredKeys_1_1.value;
                        id = ser.hexToUint8Array(this.keys.get(key));
                        return [4 /*yield*/, navigator.credentials.get({
                                publicKey: {
                                    timeout: 60000,
                                    allowCredentials: [{
                                            id: id,
                                            type: 'public-key',
                                        }],
                                    challenge: digest.buffer,
                                },
                            })];
                    case 7:
                        assertion = _l.sent();
                        e = new elliptic_1.ec('p256');
                        pubKey = e.keyFromPublic(numeric.stringToPublicKey(key).data.subarray(0, 33)).getPublic();
                        fixup = function (x) {
                            var a = Array.from(x);
                            while (a.length < 32) {
                                a.unshift(0);
                            }
                            while (a.length > 32) {
                                if (a.shift() !== 0) {
                                    throw new Error('Signature has an r or s that is too big');
                                }
                            }
                            return new Uint8Array(a);
                        };
                        der = new ser.SerialBuffer({ array: new Uint8Array(assertion.response.signature) });
                        if (der.get() !== 0x30) {
                            throw new Error('Signature missing DER prefix');
                        }
                        if (der.get() !== der.array.length - 2) {
                            throw new Error('Signature has bad length');
                        }
                        if (der.get() !== 0x02) {
                            throw new Error('Signature has bad r marker');
                        }
                        r = fixup(der.getUint8Array(der.get()));
                        if (der.get() !== 0x02) {
                            throw new Error('Signature has bad s marker');
                        }
                        s = fixup(der.getUint8Array(der.get()));
                        whatItReallySigned = new ser.SerialBuffer();
                        whatItReallySigned.pushArray(new Uint8Array(assertion.response.authenticatorData));
                        _g = (_f = whatItReallySigned).pushArray;
                        _h = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', assertion.response.clientDataJSON)];
                    case 8:
                        _g.apply(_f, [new (_h.apply(Uint8Array, [void 0, _l.sent()]))()]);
                        _j = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', whatItReallySigned.asUint8Array().slice())];
                    case 9:
                        hash_1 = new (_j.apply(Uint8Array, [void 0, _l.sent()]))();
                        recid = e.getKeyRecoveryParam(hash_1, new Uint8Array(assertion.response.signature), pubKey);
                        sigData = new ser.SerialBuffer();
                        sigData.push(recid + 27 + 4);
                        sigData.pushArray(r);
                        sigData.pushArray(s);
                        sigData.pushBytes(new Uint8Array(assertion.response.authenticatorData));
                        sigData.pushBytes(new Uint8Array(assertion.response.clientDataJSON));
                        sig = numeric.signatureToString({
                            type: numeric.KeyType.wa,
                            data: sigData.asUint8Array().slice(),
                        });
                        signatures.push(sig);
                        _l.label = 10;
                    case 10:
                        requiredKeys_1_1 = requiredKeys_1.next();
                        return [3 /*break*/, 6];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_1_1 = _l.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (requiredKeys_1_1 && !requiredKeys_1_1.done && (_k = requiredKeys_1.return)) _k.call(requiredKeys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/, { signatures: signatures, serializedTransaction: serializedTransaction, serializedContextFreeData: serializedContextFreeData }];
                }
            });
        });
    };
    return WebAuthnSignatureProvider;
}());
exports.WebAuthnSignatureProvider = WebAuthnSignatureProvider;
//# sourceMappingURL=eosjs-webauthn-sig.js.map
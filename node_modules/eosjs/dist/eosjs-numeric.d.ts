/** Is `bignum` a negative number? */
export declare const isNegative: (bignum: Uint8Array) => boolean;
/** Negate `bignum` */
export declare const negate: (bignum: Uint8Array) => void;
/**
 * Convert an unsigned decimal number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
export declare const decimalToBinary: (size: number, s: string) => Uint8Array;
/**
 * Convert a signed decimal number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
export declare const signedDecimalToBinary: (size: number, s: string) => Uint8Array;
/**
 * Convert `bignum` to an unsigned decimal number
 *
 * @param minDigits 0-pad result to this many digits
 */
export declare const binaryToDecimal: (bignum: Uint8Array, minDigits?: number) => string;
/**
 * Convert `bignum` to a signed decimal number
 *
 * @param minDigits 0-pad result to this many digits
 */
export declare const signedBinaryToDecimal: (bignum: Uint8Array, minDigits?: number) => string;
/**
 * Convert an unsigned base-58 number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
export declare const base58ToBinary: (size: number, s: string) => Uint8Array;
/**
 * Convert `bignum` to a base-58 number
 *
 * @param minDigits 0-pad result to this many digits
 */
export declare const binaryToBase58: (bignum: Uint8Array, minDigits?: number) => string;
/** Convert an unsigned base-64 number in `s` to a bignum */
export declare const base64ToBinary: (s: string) => Uint8Array;
/** Key types this library supports */
export declare enum KeyType {
    k1 = 0,
    r1 = 1,
    wa = 2
}
/** Public key data size, excluding type field */
export declare const publicKeyDataSize = 33;
/** Private key data size, excluding type field */
export declare const privateKeyDataSize = 32;
/** Signature data size, excluding type field */
export declare const signatureDataSize = 65;
/** Public key, private key, or signature in binary form */
export interface Key {
    type: KeyType;
    data: Uint8Array;
}
/** Convert key in `s` to binary form */
export declare const stringToPublicKey: (s: string) => Key;
/** Convert public `key` to legacy string (base-58) form */
export declare const publicKeyToLegacyString: (key: Key) => string;
/** Convert `key` to string (base-58) form */
export declare const publicKeyToString: (key: Key) => string;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
export declare const convertLegacyPublicKey: (s: string) => string;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
export declare const convertLegacyPublicKeys: (keys: string[]) => string[];
/** Convert key in `s` to binary form */
export declare const stringToPrivateKey: (s: string) => Key;
/** Convert private `key` to legacy string (base-58) form */
export declare const privateKeyToLegacyString: (key: Key) => string;
/** Convert `key` to string (base-58) form */
export declare const privateKeyToString: (key: Key) => string;
/** Convert key in `s` to binary form */
export declare const stringToSignature: (s: string) => Key;
/** Convert `signature` to string (base-58) form */
export declare const signatureToString: (signature: Key) => string;

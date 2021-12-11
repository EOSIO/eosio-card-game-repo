import { ec as EC } from 'elliptic';
import { Key, KeyType } from './eosjs-numeric';
/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export declare class PublicKey {
    private key;
    private ec;
    constructor(key: Key, ec: EC);
    /** Instantiate public key from an EOSIO-format public key */
    static fromString(publicKeyStr: string, ec?: EC): PublicKey;
    /** Instantiate public key from an `elliptic`-format public key */
    static fromElliptic(publicKey: EC.KeyPair, keyType: KeyType, ec?: EC): PublicKey;
    /** Export public key as EOSIO-format public key */
    toString(): string;
    /** Export public key as Legacy EOSIO-format public key */
    toLegacyString(): string;
    /** Export public key as `elliptic`-format public key */
    toElliptic(): EC.KeyPair;
    /** Get key type from key */
    getType(): KeyType;
    /** Validate a public key */
    isValid(): boolean;
}

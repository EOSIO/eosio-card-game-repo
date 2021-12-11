/// <reference types="node" />
import { BNInput, ec as EC } from 'elliptic';
import { Key, KeyType } from './eosjs-numeric';
import { PublicKey } from './eosjs-key-conversions';
/** Represents/stores a Signature and provides easy conversion for use with `elliptic` lib */
export declare class Signature {
    private signature;
    private ec;
    constructor(signature: Key, ec: EC);
    /** Instantiate Signature from an EOSIO-format Signature */
    static fromString(sig: string, ec?: EC): Signature;
    /** Instantiate Signature from an `elliptic`-format Signature */
    static fromElliptic(ellipticSig: EC.Signature, keyType: KeyType, ec?: EC): Signature;
    /** Export Signature as `elliptic`-format Signature
     * NOTE: This isn't an actual elliptic-format Signature, as ec.Signature is not exported by the library.
     * That's also why the return type is `any`.  We're *actually* returning an object with the 3 params
     * not an ec.Signature.
     * Further NOTE: @types/elliptic shows ec.Signature as exported; it is *not*.  Hence the `any`.
     */
    toElliptic(): any;
    /** Export Signature as EOSIO-format Signature */
    toString(): string;
    /** Export Signature in binary format */
    toBinary(): Uint8Array;
    /** Get key type from signature */
    getType(): KeyType;
    /** Verify a signature with a message or hashed message digest and public key */
    verify(data: BNInput, publicKey: PublicKey, shouldHash?: boolean, encoding?: BufferEncoding): boolean;
    /** Recover a public key from a message or hashed message digest and signature */
    recover(data: BNInput, shouldHash?: boolean, encoding?: BufferEncoding): PublicKey;
}

/// <reference types="node" />
import { PrivateKey, PublicKey } from './eosjs-jssig';
import { ec as EC } from 'elliptic';
export declare const ecc: {
    initialize: () => void;
    unsafeRandomKey: () => void;
    randomKey: (cpuEntropyBits?: number, options?: {
        secureEnv?: boolean;
        ecOptions?: EC.GenKeyPairOptions;
    }) => Promise<string>;
    seedPrivate: () => void;
    privateToPublic: (key: string, pubkey_prefix?: string) => string;
    isValidPublic: (pubkey: string, pubkey_prefix?: string) => boolean;
    isValidPrivate: (wif: string) => boolean;
    sign: (data: string | Buffer, privateKey: string | PrivateKey, encoding?: BufferEncoding) => string;
    signHash: (dataSha256: string | Buffer, privateKey: string | PrivateKey, encoding?: BufferEncoding) => string;
    verify: (signature: string, data: string, pubKey: string | PublicKey, encoding?: BufferEncoding, hashData?: boolean) => boolean;
    recover: (signature: string, data: string, encoding?: BufferEncoding) => string;
    recoverHash: (signature: string, dataSha256: string | Buffer, encoding?: BufferEncoding) => string;
    sha256: (data: string | Buffer, resultEncoding?: string, encoding?: string) => string | Buffer;
};

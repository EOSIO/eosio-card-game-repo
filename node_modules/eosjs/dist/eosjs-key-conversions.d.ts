/// <reference types="node" />
import { ec as EC } from 'elliptic';
import { KeyType } from './eosjs-numeric';
import { PublicKey } from './PublicKey';
import { PrivateKey } from './PrivateKey';
export { PrivateKey } from './PrivateKey';
export { PublicKey } from './PublicKey';
export { Signature } from './Signature';
/** Construct the elliptic curve object based on key type */
export declare const constructElliptic: (type: KeyType) => EC;
export declare const generateKeyPair: (type: KeyType, options?: {
    secureEnv?: boolean;
    ecOptions?: EC.GenKeyPairOptions;
}) => {
    publicKey: PublicKey;
    privateKey: PrivateKey;
};
export declare const sha256: (data: string | Buffer) => number[] | string;

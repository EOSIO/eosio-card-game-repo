/**
 * @module JS-Sig
 */
import { ec } from 'elliptic';
import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import { PushTransactionArgs } from './eosjs-rpc-interfaces';
import { PrivateKey, PublicKey, Signature } from './eosjs-key-conversions';
/** Construct the digest from transaction details */
declare const digestFromSerializedData: (chainId: string, serializedTransaction: Uint8Array, serializedContextFreeData?: Uint8Array, e?: ec) => string;
/** Signs transactions using in-process private keys */
declare class JsSignatureProvider implements SignatureProvider {
    /** map public to private keys */
    keys: Map<string, ec.KeyPair>;
    /** public keys */
    availableKeys: string[];
    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]);
    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    getAvailableKeys(): Promise<string[]>;
    /** Sign a transaction */
    sign({ chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs): Promise<PushTransactionArgs>;
}
export { PrivateKey, PublicKey, Signature, digestFromSerializedData, JsSignatureProvider, };

/**
 * @module API
 */
import { AbiProvider, ActionSerializerType, AuthorityProvider, BinaryAbi, CachedAbi, ContextFreeGroupCallback, Query, QueryConfig, SignatureProvider, TransactConfig, Transaction, TransactResult } from './eosjs-api-interfaces';
import { JsonRpc } from './eosjs-jsonrpc';
import { Abi, PushTransactionArgs, ReadOnlyTransactResult } from './eosjs-rpc-interfaces';
import * as ser from './eosjs-serialize';
export declare class Api {
    /** Issues RPC calls */
    rpc: JsonRpc;
    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    authorityProvider: AuthorityProvider;
    /** Supplies ABIs in raw form (binary) */
    abiProvider: AbiProvider;
    /** Signs transactions */
    signatureProvider: SignatureProvider;
    /** Identifies chain */
    chainId: string;
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
    /** Converts abi files between binary and structured form (`abi.abi.json`) */
    abiTypes: Map<string, ser.Type>;
    /** Converts transactions between binary and structured form (`transaction.abi.json`) */
    transactionTypes: Map<string, ser.Type>;
    /** Holds information needed to serialize contract actions */
    contracts: Map<string, ser.Contract>;
    /** Fetched abis */
    cachedAbis: Map<string, CachedAbi>;
    /**
     * @param args
     * * `rpc`: Issues RPC calls
     * * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     * * `abiProvider`: Supplies ABIs in raw form (binary)
     * * `signatureProvider`: Signs transactions
     * * `chainId`: Identifies chain
     * * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args: {
        rpc: JsonRpc;
        authorityProvider?: AuthorityProvider;
        abiProvider?: AbiProvider;
        signatureProvider: SignatureProvider;
        chainId?: string;
        textEncoder?: TextEncoder;
        textDecoder?: TextDecoder;
    });
    /** Decodes an abi as Uint8Array into json. */
    rawAbiToJson(rawAbi: Uint8Array): Abi;
    /** Encodes a json abi as Uint8Array. */
    jsonToRawAbi(jsonAbi: Abi): Uint8Array;
    /** Get abi in both binary and structured forms. Fetch when needed. */
    getCachedAbi(accountName: string, reload?: boolean): Promise<CachedAbi>;
    /** Get abi in structured form. Fetch when needed. */
    getAbi(accountName: string, reload?: boolean): Promise<Abi>;
    /** Get abis needed by a transaction */
    getTransactionAbis(transaction: Transaction, reload?: boolean): Promise<BinaryAbi[]>;
    /** Get data needed to serialize actions in a contract */
    getContract(accountName: string, reload?: boolean): Promise<ser.Contract>;
    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    serialize(buffer: ser.SerialBuffer, type: string, value: any): void;
    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    deserialize(buffer: ser.SerialBuffer, type: string): any;
    /** Convert a transaction to binary */
    serializeTransaction(transaction: Transaction): Uint8Array;
    /** Serialize context-free data */
    serializeContextFreeData(contextFreeData: Uint8Array[]): Uint8Array;
    /** Convert a transaction from binary. Leaves actions in hex. */
    deserializeTransaction(transaction: Uint8Array): Transaction;
    private transactionExtensions;
    serializeTransactionExtensions(transaction: Transaction): [number, string][];
    deserializeTransactionExtensions(data: [number, string][]): any[];
    deleteTransactionExtensionObjects(transaction: Transaction): Transaction;
    /** Convert actions to hex */
    serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]>;
    /** Convert actions from hex */
    deserializeActions(actions: ser.Action[]): Promise<ser.Action[]>;
    /** Convert a transaction from binary. Also deserializes actions. */
    deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<Transaction>;
    /** Deflate a serialized object */
    deflateSerializedArray(serializedArray: Uint8Array): Uint8Array;
    /** Inflate a compressed serialized object */
    inflateSerializedArray(compressedSerializedArray: Uint8Array): Uint8Array;
    /**
     * Create and optionally broadcast a transaction.
     *
     * Named Parameters:
     * `broadcast`: broadcast this transaction?
     * `sign`: sign this transaction?
     * `compression`: compress this transaction?
     * `readOnlyTrx`: read only transaction?
     * `returnFailureTraces`: return failure traces? (only available for read only transactions currently)
     *
     * If both `blocksBehind` and `expireSeconds` are present,
     * then fetch the block which is `blocksBehind` behind head block,
     * use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
     *
     * If both `useLastIrreversible` and `expireSeconds` are present,
     * then fetch the last irreversible block, use it as a reference for TAPoS,
     * and expire the transaction `expireSeconds` after that block's time.
     *
     * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
     */
    transact(transaction: Transaction, { broadcast, sign, readOnlyTrx, returnFailureTraces, requiredKeys, compression, blocksBehind, useLastIrreversible, expireSeconds }?: TransactConfig): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs>;
    query(account: string, short: boolean, query: Query, { sign, requiredKeys, authorization }: QueryConfig): Promise<any>;
    /** Broadcast a signed transaction */
    pushSignedTransaction({ signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs, readOnlyTrx?: boolean, returnFailureTraces?: boolean): Promise<TransactResult | ReadOnlyTransactResult>;
    pushCompressedSignedTransaction({ signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs, readOnlyTrx?: boolean, returnFailureTraces?: boolean): Promise<TransactResult | ReadOnlyTransactResult>;
    private generateTapos;
    private hasRequiredTaposFields;
    private tryGetBlockHeaderState;
    private tryGetBlockInfo;
    private tryRefBlockFromGetInfo;
    with(accountName: string): ActionBuilder;
    buildTransaction(cb?: (tx: TransactionBuilder) => void): TransactionBuilder | void;
}
export declare class TransactionBuilder {
    private api;
    private actions;
    private contextFreeGroups;
    constructor(api: Api);
    with(accountName: string): ActionBuilder;
    associateContextFree(contextFreeGroup: ContextFreeGroupCallback): TransactionBuilder;
    send(config?: TransactConfig): Promise<PushTransactionArgs | ReadOnlyTransactResult | TransactResult>;
}
export declare class ActionBuilder {
    private api;
    private readonly accountName;
    serializedData: ser.SerializedAction;
    constructor(api: Api, accountName: string);
    as(actorName?: string | ser.Authorization[]): ActionSerializerType;
}

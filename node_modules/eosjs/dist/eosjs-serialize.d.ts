/**
 * @module Serialize
 */
import { TransactionHeader } from './eosjs-api-interfaces';
import { Abi, BlockTaposInfo } from './eosjs-rpc-interfaces';
import { Query } from './eosjs-api-interfaces';
/** A field in an abi */
export interface Field {
    /** Field name */
    name: string;
    /** Type name in string form */
    typeName: string;
    /** Type of the field */
    type: Type;
}
/** Options for serialize() and deserialize() */
export interface SerializerOptions {
    bytesAsUint8Array?: boolean;
}
/** State for serialize() and deserialize() */
export declare class SerializerState {
    options: SerializerOptions;
    /** Have any binary extensions been skipped? */
    skippedBinaryExtension: boolean;
    constructor(options?: SerializerOptions);
}
/**
 * An Anyvar (non-short form) may be any of the following:
 *  * null
 *  * string
 *  * number
 *    * Caution: assumes number is int32. Use {type, value} form for other numeric types
 *  * an array of anyvar
 *  * {type, value}
 *      * type is a string matching one of the predefined types in anyvarDefs
 *      * value:
 *          * If type === 'any_object', then value is an object. The values within the object are anyvar.
 *          * If type === 'any_array', then value is an array of anyvar.
 *          * Else, value must be eosjs-compatible with the specified type (e.g. uint64 should be a string
 *            containing the value in decimal).
 *  * Other object. The values within the object are anyvar.
 *
 * The short form is more convenient, but it can't be converted back to binary (serialized).
 * Wherever the anyvar would have {type, value}, it has just the value instead.
 */
export declare type Anyvar = null | string | number | Anyvar[] | {
    type: string;
    value: any;
} | Record<string, unknown>;
/** A type in an abi */
export interface Type {
    /** Type name */
    name: string;
    /** Type name this is an alias of, if any */
    aliasOfName: string;
    /** Type this is an array of, if any */
    arrayOf: Type;
    /** Type this is an optional of, if any */
    optionalOf: Type;
    /** Marks binary extension fields */
    extensionOf?: Type;
    /** Base name of this type, if this is a struct */
    baseName: string;
    /** Base of this type, if this is a struct */
    base: Type;
    /** Contained fields, if this is a struct */
    fields: Field[];
    /** Convert `data` to binary form and store in `buffer` */
    serialize: (buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean) => void;
    /** Convert data in `buffer` from binary form */
    deserialize: (buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean) => any;
}
/** Structural representation of a symbol */
export interface Symbol {
    /** Name of the symbol, not including precision */
    name: string;
    /** Number of digits after the decimal point */
    precision: number;
}
export interface Contract {
    actions: Map<string, Type>;
    types: Map<string, Type>;
}
export interface Authorization {
    actor: string;
    permission: string;
}
/** Action with data in structured form */
export interface Action {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
    hex_data?: string;
}
/** Action with data in serialized hex form */
export interface SerializedAction {
    account: string;
    name: string;
    authorization: Authorization[];
    data: string;
}
/** Serialize and deserialize data */
export declare class SerialBuffer {
    /** Amount of valid data in `array` */
    length: number;
    /** Data in serialized (binary) form */
    array: Uint8Array;
    /** Current position while reading (deserializing) */
    readPos: number;
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
    /**
     * @param __namedParameters
     * `array`: `null` if serializing, or binary data to deserialize
     * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
     */
    constructor({ textEncoder, textDecoder, array }?: {
        textEncoder?: TextEncoder;
        textDecoder?: TextDecoder;
        array?: Uint8Array;
    });
    /** Resize `array` if needed to have at least `size` bytes free */
    reserve(size: number): void;
    /** Is there data available to read? */
    haveReadData(): boolean;
    /** Restart reading from the beginning */
    restartRead(): void;
    /** Return data with excess storage trimmed away */
    asUint8Array(): Uint8Array;
    /** Append bytes */
    pushArray(v: number[] | Uint8Array): void;
    /** Append bytes */
    push(...v: number[]): void;
    /** Get a single byte */
    get(): number;
    /** Append bytes in `v`. Throws if `len` doesn't match `v.length` */
    pushUint8ArrayChecked(v: Uint8Array, len: number): void;
    /** Get `len` bytes */
    getUint8Array(len: number): Uint8Array;
    /** Skip `len` bytes */
    skip(len: number): void;
    /** Append a `uint16` */
    pushUint16(v: number): void;
    /** Get a `uint16` */
    getUint16(): number;
    /** Append a `uint32` */
    pushUint32(v: number): void;
    /** Get a `uint32` */
    getUint32(): number;
    /** Append a `uint64`. *Caution*: `number` only has 53 bits of precision */
    pushNumberAsUint64(v: number): void;
    /**
     * Get a `uint64` as a `number`. *Caution*: `number` only has 53 bits of precision; some values will change.
     * `numeric.binaryToDecimal(serialBuffer.getUint8Array(8))` recommended instead
     */
    getUint64AsNumber(): number;
    /** Append a `varuint32` */
    pushVaruint32(v: number): void;
    /** Get a `varuint32` */
    getVaruint32(): number;
    /** Append a `varint32` */
    pushVarint32(v: number): void;
    /** Get a `varint32` */
    getVarint32(): number;
    /** Append a `float32` */
    pushFloat32(v: number): void;
    /** Get a `float32` */
    getFloat32(): number;
    /** Append a `float64` */
    pushFloat64(v: number): void;
    /** Get a `float64` */
    getFloat64(): number;
    /** Append a `name` */
    pushName(s: string): void;
    /** Get a `name` */
    getName(): string;
    /** Append length-prefixed binary data */
    pushBytes(v: number[] | Uint8Array): void;
    /** Get length-prefixed binary data */
    getBytes(): Uint8Array;
    /** Append a string */
    pushString(v: string): void;
    /** Get a string */
    getString(): string;
    /** Append a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    pushSymbolCode(name: string): void;
    /** Get a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    getSymbolCode(): string;
    /** Append a `symbol` */
    pushSymbol({ name, precision }: {
        name: string;
        precision: number;
    }): void;
    /** Get a `symbol` */
    getSymbol(): {
        name: string;
        precision: number;
    };
    /** Append an asset */
    pushAsset(s: string): void;
    /** Get an asset */
    getAsset(): string;
    /** Append a public key */
    pushPublicKey(s: string): void;
    /** Get a public key */
    getPublicKey(): string;
    /** Append a private key */
    pushPrivateKey(s: string): void;
    /** Get a private key */
    getPrivateKey(): string;
    /** Append a signature */
    pushSignature(s: string): void;
    /** Get a signature */
    getSignature(): string;
}
/** Is this a supported ABI version? */
export declare const supportedAbiVersion: (version: string) => boolean;
/** Convert date in ISO format to `time_point` (miliseconds since epoch) */
export declare const dateToTimePoint: (date: string) => number;
/** Convert `time_point` (miliseconds since epoch) to date in ISO format */
export declare const timePointToDate: (us: number) => string;
/** Convert date in ISO format to `time_point_sec` (seconds since epoch) */
export declare const dateToTimePointSec: (date: string) => number;
/** Convert `time_point_sec` (seconds since epoch) to to date in ISO format */
export declare const timePointSecToDate: (sec: number) => string;
/** Convert date in ISO format to `block_timestamp_type` (half-seconds since a different epoch) */
export declare const dateToBlockTimestamp: (date: string) => number;
/** Convert `block_timestamp_type` (half-seconds since a different epoch) to to date in ISO format */
export declare const blockTimestampToDate: (slot: number) => string;
/** Convert `string` to `Symbol`. format: `precision,NAME`. */
export declare const stringToSymbol: (s: string) => {
    name: string;
    precision: number;
};
/** Convert `Symbol` to `string`. format: `precision,NAME`. */
export declare const symbolToString: ({ name, precision }: {
    name: string;
    precision: number;
}) => string;
/** Convert binary data to hex */
export declare const arrayToHex: (data: Uint8Array) => string;
/** Convert hex to binary data */
export declare const hexToUint8Array: (hex: string) => Uint8Array;
/** Create the set of types built-in to the abi format */
export declare const createInitialTypes: () => Map<string, Type>;
export declare const createAbiTypes: () => Map<string, Type>;
export declare const createTransactionExtensionTypes: () => Map<string, Type>;
export declare const createTransactionTypes: () => Map<string, Type>;
/** Get type from `types` */
export declare const getType: (types: Map<string, Type>, name: string) => Type;
/**
 * Get types from abi
 *
 * @param initialTypes Set of types to build on.
 * In most cases, it's best to fill this from a fresh call to `getTypesFromAbi()`.
 */
export declare const getTypesFromAbi: (initialTypes: Map<string, Type>, abi?: Abi) => Map<string, Type>;
/** TAPoS: Return transaction fields which reference `refBlock` and expire `expireSeconds` after `timestamp` */
export declare const transactionHeader: (refBlock: BlockTaposInfo, expireSeconds: number) => TransactionHeader;
/** Convert action data to serialized form (hex) */
export declare const serializeActionData: (contract: Contract, account: string, name: string, data: any, textEncoder: TextEncoder, textDecoder: TextDecoder) => string;
/** Return action in serialized form */
export declare const serializeAction: (contract: Contract, account: string, name: string, authorization: Authorization[], data: any, textEncoder: TextEncoder, textDecoder: TextDecoder) => SerializedAction;
/** Deserialize action data. If `data` is a `string`, then it's assumed to be in hex. */
export declare const deserializeActionData: (contract: Contract, account: string, name: string, data: string | Uint8Array | number[], textEncoder: TextEncoder, textDecoder: TextDecoder) => any;
/** Deserialize action. If `data` is a `string`, then it's assumed to be in hex. */
export declare const deserializeAction: (contract: Contract, account: string, name: string, authorization: Authorization[], data: string | Uint8Array | number[], textEncoder: TextEncoder, textDecoder: TextDecoder) => Action;
export declare const serializeAnyvar: (buffer: SerialBuffer, anyvar: Anyvar) => void;
export declare const deserializeAnyvar: (buffer: SerialBuffer, state?: SerializerState) => any;
export declare const deserializeAnyvarShort: (buffer: SerialBuffer) => any;
export declare const serializeAnyObject: (buffer: SerialBuffer, obj: any) => void;
export declare const deserializeAnyObject: (buffer: SerialBuffer, state?: SerializerState) => any;
export declare const serializeAnyArray: (buffer: SerialBuffer, arr: Anyvar[]) => void;
export declare const deserializeAnyArray: (buffer: SerialBuffer, state?: SerializerState) => any[];
export declare const serializeQuery: (buffer: SerialBuffer, query: Query) => void;

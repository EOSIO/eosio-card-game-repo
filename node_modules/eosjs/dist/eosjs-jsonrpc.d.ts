/**
 * @module JSON-RPC
 */
import { AbiProvider, AuthorityProvider, AuthorityProviderArgs, BinaryAbi, TransactResult } from './eosjs-api-interfaces';
import { AbiBinToJsonResult, AbiJsonToBinResult, GetAbiResult, GetAccountResult, GetAccountsByAuthorizersResult, GetActivatedProtocolFeaturesParams, GetActivatedProtocolFeaturesResult, GetBlockInfoResult, GetBlockResult, GetCodeResult, GetCodeHashResult, GetCurrencyStatsResult, GetInfoResult, GetProducerScheduleResult, GetProducersResult, GetRawCodeAndAbiResult, GetRawAbiResult, GetScheduledTransactionsResult, GetTableRowsResult, PushTransactionArgs, ReadOnlyTransactResult, GetBlockHeaderStateResult, GetTableByScopeResult, DBSizeGetResult, TraceApiGetBlockResult, GetActionsResult, GetTransactionResult, GetKeyAccountsResult, GetControlledAccountsResult } from './eosjs-rpc-interfaces';
import { Authorization } from './eosjs-serialize';
/** Make RPC calls */
export declare class JsonRpc implements AuthorityProvider, AbiProvider {
    endpoint: string;
    fetchBuiltin: (input?: any, init?: any) => Promise<any>;
    /**
     * @param args
     * `fetch`:
     * browsers: leave `null` or `undefined`
     * node: provide an implementation
     */
    constructor(endpoint: string, args?: {
        fetch?: (input?: any, init?: any) => Promise<any>;
    });
    /** Post `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    fetch(path: string, body: any): Promise<any>;
    abi_bin_to_json(code: string, action: string, binargs: string): Promise<AbiBinToJsonResult>;
    abi_json_to_bin(code: string, action: string, args: any[]): Promise<AbiJsonToBinResult>;
    /** Raw call to `/v1/chain/get_abi` */
    get_abi(accountName: string): Promise<GetAbiResult>;
    /** Raw call to `/v1/chain/get_account` */
    get_account(accountName: string): Promise<GetAccountResult>;
    /** Raw call to `/v1/chain/get_accounts_by_authorizers` */
    get_accounts_by_authorizers(accounts: Authorization[], keys: string[]): Promise<GetAccountsByAuthorizersResult>;
    /** Raw call to `get_activated_protocol_features` */
    get_activated_protocol_features({ limit, search_by_block_num, reverse, lower_bound, upper_bound, }: GetActivatedProtocolFeaturesParams): Promise<GetActivatedProtocolFeaturesResult>;
    /** Raw call to `/v1/chain/get_block_header_state` */
    get_block_header_state(blockNumOrId: number | string): Promise<GetBlockHeaderStateResult>;
    /** Raw call to `/v1/chain/get_block_info` */
    get_block_info(blockNum: number): Promise<GetBlockInfoResult>;
    /** Raw call to `/v1/chain/get_block` */
    get_block(blockNumOrId: number | string): Promise<GetBlockResult>;
    /** Raw call to `/v1/chain/get_code` */
    get_code(accountName: string): Promise<GetCodeResult>;
    /** Raw call to `/v1/chain/get_code_hash` */
    get_code_hash(accountName: string): Promise<GetCodeHashResult>;
    /** Raw call to `/v1/chain/get_currency_balance` */
    get_currency_balance(code: string, account: string, symbol?: string): Promise<string[]>;
    /** Raw call to `/v1/chain/get_currency_stats` */
    get_currency_stats(code: string, symbol: string): Promise<GetCurrencyStatsResult>;
    /** Raw call to `/v1/chain/get_info` */
    get_info(): Promise<GetInfoResult>;
    /** Raw call to `/v1/chain/get_producer_schedule` */
    get_producer_schedule(): Promise<GetProducerScheduleResult>;
    /** Raw call to `/v1/chain/get_producers` */
    get_producers(json?: boolean, lowerBound?: string, limit?: number): Promise<GetProducersResult>;
    /** Raw call to `/v1/chain/get_raw_code_and_abi` */
    get_raw_code_and_abi(accountName: string): Promise<GetRawCodeAndAbiResult>;
    /** calls `/v1/chain/get_raw_code_and_abi` and pulls out unneeded raw wasm code */
    getRawAbi(accountName: string): Promise<BinaryAbi>;
    /** Raw call to `/v1/chain/get_raw_abi` */
    get_raw_abi(accountName: string): Promise<GetRawAbiResult>;
    /** Raw call to `/v1/chain/get_scheduled_transactions` */
    get_scheduled_transactions(json?: boolean, lowerBound?: string, limit?: number): Promise<GetScheduledTransactionsResult>;
    /** Raw call to `/v1/chain/get_table_rows` */
    get_table_rows({ json, code, scope, table, lower_bound, upper_bound, index_position, key_type, limit, reverse, show_payer, }: any): Promise<GetTableRowsResult>;
    /** Raw call to `/v1/chain/get_kv_table_rows` */
    get_kv_table_rows({ json, code, table, index_name, encode_type, index_value, lower_bound, upper_bound, limit, reverse, show_payer, }: any): Promise<GetTableRowsResult>;
    /** Raw call to `/v1/chain/get_table_by_scope` */
    get_table_by_scope({ code, table, lower_bound, upper_bound, limit, }: any): Promise<GetTableByScopeResult>;
    /** Get subset of `availableKeys` needed to meet authorities in `transaction`. Implements `AuthorityProvider` */
    getRequiredKeys(args: AuthorityProviderArgs): Promise<string[]>;
    /** Push a serialized transaction (replaced by send_transaction, but returned format has changed) */
    push_transaction({ signatures, compression, serializedTransaction, serializedContextFreeData }: PushTransactionArgs): Promise<TransactResult>;
    /** Raw call to `/v1/chain/push_ro_transaction */
    push_ro_transaction({ signatures, compression, serializedTransaction }: PushTransactionArgs, returnFailureTraces?: boolean): Promise<ReadOnlyTransactResult>;
    push_transactions(transactions: PushTransactionArgs[]): Promise<TransactResult[]>;
    /** Send a serialized transaction */
    send_transaction({ signatures, compression, serializedTransaction, serializedContextFreeData }: PushTransactionArgs): Promise<TransactResult>;
    /** Raw call to `/v1/db_size/get` */
    db_size_get(): Promise<DBSizeGetResult>;
    /** Raw call to `/v1/trace_api/get_block` */
    trace_get_block(block_num: number): Promise<TraceApiGetBlockResult>;
    /** Raw call to `/v1/history/get_actions` */
    history_get_actions(accountName: string, pos?: number, offset?: number): Promise<GetActionsResult>;
    /** Raw call to `/v1/history/get_transaction` */
    history_get_transaction(id: string, blockNumHint?: number): Promise<GetTransactionResult>;
    /** Raw call to `/v1/history/get_key_accounts` */
    history_get_key_accounts(publicKey: string): Promise<GetKeyAccountsResult>;
    /** Raw call to `/v1/history/get_controlled_accounts` */
    history_get_controlled_accounts(controllingAccount: string): Promise<GetControlledAccountsResult>;
}

export declare class TransactionModel {
    nonce?: number;
    value?: string;
    sender?: string;
    receiver?: string;
    gasPrice?: number;
    gasLimit?: number;
    data?: string;
    chainID?: string;
    version?: number;
    options?: number;
    status?: string;
    signature?: string;
    constructor(init?: Partial<TransactionModel>);
}

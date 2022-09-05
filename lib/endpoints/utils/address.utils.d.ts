/// <reference types="node" />
export declare class AddressUtils {
    static bech32Encode(publicKey: string): string;
    static bech32Decode(address: string): string;
    static isAddressValid(address: string | Buffer): boolean;
    static computeShard(hexPubKey: string): number;
    static isSmartContractAddress(address: string): boolean;
    private static isAddressOfMetachain;
    static decodeCodeMetadata(codeMetadata: string): {
        isUpgradeable: boolean;
        isReadable: boolean;
        isPayable: boolean;
        isPayableBySmartContract: boolean;
    } | undefined;
}

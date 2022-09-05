export declare class NumberUtils {
    static denominate(value: bigint, decimals?: number): number;
    static denominateString(value: string, decimals?: number): number;
    static toDenominatedString(amount: bigint, decimals?: number): string;
    static numberDecode(encoded: string): string;
}

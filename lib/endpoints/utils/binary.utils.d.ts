export declare class BinaryUtils {
    static base64Encode(str: string): string;
    static base64Decode(str: string): string;
    static tryBase64ToBigInt(str: string): BigInt | undefined;
    static base64ToBigInt(str: string): BigInt;
    static tryBase64ToHex(str: string): string | undefined;
    static base64ToHex(str: string): string;
    static stringToHex(str: string): string;
    static tryBase64ToAddress(str: string): string | undefined;
    static base64ToAddress(str: string): string;
    static hexToString(hex: string): string;
    static hexToNumber(hex: string): number;
    static hexToBigInt(hex: string): BigInt;
    static padHex(value: string): string;
    static hexToArray(value: string): string[];
}

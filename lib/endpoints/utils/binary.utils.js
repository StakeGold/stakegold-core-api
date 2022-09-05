"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryUtils = void 0;
const address_utils_1 = require("./address.utils");
function base64DecodeBinary(str) {
    return Buffer.from(str, 'base64');
}
class BinaryUtils {
    static base64Encode(str) {
        return Buffer.from(str).toString('base64');
    }
    static base64Decode(str) {
        return base64DecodeBinary(str).toString('binary');
    }
    static tryBase64ToBigInt(str) {
        try {
            return this.base64ToBigInt(str);
        }
        catch (_a) {
            return undefined;
        }
    }
    static base64ToBigInt(str) {
        return BigInt('0x' + this.base64ToHex(str));
    }
    static tryBase64ToHex(str) {
        try {
            return this.base64ToHex(str);
        }
        catch (_a) {
            return undefined;
        }
    }
    static base64ToHex(str) {
        return Buffer.from(str, 'base64').toString('hex');
    }
    static stringToHex(str) {
        return Buffer.from(str).toString('hex');
    }
    static tryBase64ToAddress(str) {
        try {
            return this.base64ToAddress(str);
        }
        catch (_a) {
            return undefined;
        }
    }
    static base64ToAddress(str) {
        return address_utils_1.AddressUtils.bech32Encode(this.base64ToHex(str));
    }
    static hexToString(hex) {
        return Buffer.from(hex, 'hex').toString('ascii');
    }
    static hexToNumber(hex) {
        return parseInt(hex, 16);
    }
    static hexToBigInt(hex) {
        if (!hex) {
            return BigInt(0);
        }
        return BigInt('0x' + hex);
    }
    static padHex(value) {
        return (value.length % 2 ? '0' + value : value);
    }
    static hexToArray(value) {
        const chunks = [];
        for (let i = 0, charsLength = value.length; i < charsLength; i += 64) {
            chunks.push(value.substring(i, i + 64));
        }
        return chunks;
    }
}
exports.BinaryUtils = BinaryUtils;
//# sourceMappingURL=binary.utils.js.map
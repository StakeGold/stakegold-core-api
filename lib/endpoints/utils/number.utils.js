"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberUtils = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
class NumberUtils {
    static denominate(value, decimals = 18) {
        return new bignumber_js_1.default(value.toString())
            .dividedBy(new bignumber_js_1.default(10).pow(decimals))
            .toNumber();
    }
    static denominateString(value, decimals = 18) {
        return NumberUtils.denominate(BigInt(value), decimals);
    }
    static toDenominatedString(amount, decimals = 18) {
        let denominatedValue = new bignumber_js_1.default(amount.toString())
            .shiftedBy(-decimals)
            .toFixed(decimals);
        if (denominatedValue.includes(".")) {
            denominatedValue = denominatedValue
                .replace(/0+$/g, "")
                .replace(/\.$/g, "");
        }
        return denominatedValue;
    }
    static numberDecode(encoded) {
        const hex = Buffer.from(encoded, "base64").toString("hex");
        return new bignumber_js_1.default(hex, 16).toString(10);
    }
}
exports.NumberUtils = NumberUtils;
//# sourceMappingURL=number.utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressUtils = void 0;
const erdjs_1 = require("@elrondnetwork/erdjs");
const common_1 = require("@nestjs/common");
const binary_utils_1 = require("./binary.utils");
class AddressUtils {
    static bech32Encode(publicKey) {
        return erdjs_1.Address.fromHex(publicKey).bech32();
    }
    static bech32Decode(address) {
        return erdjs_1.Address.fromBech32(address).hex();
    }
    static isAddressValid(address) {
        try {
            new erdjs_1.Address(address);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    static computeShard(hexPubKey) {
        const numShards = 3;
        const maskHigh = parseInt('11', 2);
        const maskLow = parseInt('01', 2);
        const pubKey = Buffer.from(hexPubKey, 'hex');
        const lastByteOfPubKey = pubKey[31];
        if (AddressUtils.isAddressOfMetachain(pubKey)) {
            return 4294967295;
        }
        let shard = lastByteOfPubKey & maskHigh;
        if (shard > numShards - 1) {
            shard = lastByteOfPubKey & maskLow;
        }
        return shard;
    }
    static isSmartContractAddress(address) {
        if (address.toLowerCase() === 'metachain') {
            return true;
        }
        try {
            return new erdjs_1.Address(address).isContractAddress();
        }
        catch (error) {
            const logger = new common_1.Logger(AddressUtils.name);
            logger.error(`Error when determining whether address '${address}' is a smart contract address`);
            logger.error(error);
            return false;
        }
    }
    static isAddressOfMetachain(pubKey) {
        const metachainPrefix = Buffer.from([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
        const pubKeyPrefix = pubKey.slice(0, metachainPrefix.length);
        if (pubKeyPrefix.equals(metachainPrefix)) {
            return true;
        }
        const zeroAddress = Buffer.alloc(32).fill(0);
        if (pubKey.equals(zeroAddress)) {
            return true;
        }
        return false;
    }
    static decodeCodeMetadata(codeMetadata) {
        if (!codeMetadata) {
            return undefined;
        }
        const codeHex = binary_utils_1.BinaryUtils.tryBase64ToHex(codeMetadata);
        if (!codeHex || codeHex.length !== 4) {
            return undefined;
        }
        const firstOctet = parseInt(codeHex.slice(0, 2), 16).toString(2).padStart(4, '0');
        const isUpgradeable = firstOctet.charAt(3) === '1';
        const isReadable = firstOctet.charAt(1) === '1';
        const secondOctet = parseInt(codeHex.slice(2), 16).toString(2).padStart(4, '0');
        const isPayable = secondOctet.charAt(2) === '1';
        const isPayableBySmartContract = secondOctet.charAt(1) === '1';
        return { isUpgradeable, isReadable, isPayable, isPayableBySmartContract };
    }
}
exports.AddressUtils = AddressUtils;
//# sourceMappingURL=address.utils.js.map
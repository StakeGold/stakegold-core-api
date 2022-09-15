"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedAssetAttributes = void 0;
const out_1 = require("@elrondnetwork/erdjs/out");
class LockedAssetAttributes {
    constructor(init) {
        Object.assign(this, init);
    }
    static fromDecodedAttributes(decodedAttributes) {
        const unlockSchedule = decodedAttributes.UnlockSchedule.valueOf().map((value) => {
            var _a, _b;
            const epoch = (_a = value.unlock_epoch) === null || _a === void 0 ? void 0 : _a.toNumber();
            const percent = (_b = value.unlock_percent) === null || _b === void 0 ? void 0 : _b.toNumber();
            return {
                epoch,
                percent,
            };
        });
        return new LockedAssetAttributes({
            unlockSchedule,
            isMerged: decodedAttributes.isMerged,
        });
    }
    static fromAttributes(attributes) {
        const attributesBuffer = Buffer.from(attributes, 'base64');
        const codec = new out_1.BinaryCodec();
        const structType = LockedAssetAttributes.getStructure();
        const [decodedRaw] = codec.decodeNested(attributesBuffer, structType);
        const decoded = decodedRaw.valueOf();
        const response = LockedAssetAttributes.fromDecodedAttributes(decoded);
        return response;
    }
    static getStructure() {
        return new out_1.StructType('LockedAssetAttributes', [
            new out_1.FieldDefinition('UnlockSchedule', '', new out_1.ListType(new out_1.StructType('UnlockMilestone', [
                new out_1.FieldDefinition('unlock_epoch', '', new out_1.U64Type()),
                new out_1.FieldDefinition('unlock_percent', '', new out_1.U64Type()),
            ]))),
            new out_1.FieldDefinition('isMerged', '', new out_1.BooleanType()),
        ]);
    }
}
exports.LockedAssetAttributes = LockedAssetAttributes;
//# sourceMappingURL=LockedAssetAttributes.js.map
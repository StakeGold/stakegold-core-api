"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseAddressPipe = void 0;
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
class ParseAddressPipe {
    transform(value, _) {
        return new Promise(resolve => {
            if (value === undefined || value === '') {
                return resolve(undefined);
            }
            try {
                new out_1.Address(value);
                return resolve(value);
            }
            catch (error) {
                throw new common_1.HttpException('Validation failed (a bech32 address is expected)', common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
}
exports.ParseAddressPipe = ParseAddressPipe;
//# sourceMappingURL=parse.address.pipe.js.map
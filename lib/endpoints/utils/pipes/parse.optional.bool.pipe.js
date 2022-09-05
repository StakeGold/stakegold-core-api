"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseOptionalBoolPipe = void 0;
const common_1 = require("@nestjs/common");
class ParseOptionalBoolPipe {
    transform(value) {
        return new Promise(resolve => {
            if (value === true || value === 'true') {
                return resolve(true);
            }
            if (value === false || value === 'false') {
                return resolve(false);
            }
            if (value === null || value === undefined || value === '') {
                return resolve(undefined);
            }
            throw new common_1.HttpException('Validation failed (optional boolean string is expected)', common_1.HttpStatus.BAD_REQUEST);
        });
    }
}
exports.ParseOptionalBoolPipe = ParseOptionalBoolPipe;
//# sourceMappingURL=parse.optional.bool.pipe.js.map
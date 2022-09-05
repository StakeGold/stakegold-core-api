"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseOptionalIntPipe = void 0;
const common_1 = require("@nestjs/common");
class ParseOptionalIntPipe {
    transform(value) {
        return new Promise(resolve => {
            if (value === undefined || value === '') {
                return resolve(undefined);
            }
            if (!isNaN(Number(value))) {
                return resolve(Number(value));
            }
            throw new common_1.HttpException('Validation failed (optional number is expected)', common_1.HttpStatus.BAD_REQUEST);
        });
    }
}
exports.ParseOptionalIntPipe = ParseOptionalIntPipe;
//# sourceMappingURL=parse.optional.int.pipe.js.map
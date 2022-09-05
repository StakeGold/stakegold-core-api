"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseOptionalEnumPipe = void 0;
const common_1 = require("@nestjs/common");
class ParseOptionalEnumPipe {
    constructor(type) {
        this.type = type;
    }
    transform(value) {
        return new Promise(resolve => {
            if (value === undefined || value === '') {
                return resolve(undefined);
            }
            const values = this.getValues(this.type);
            if (values.includes(value)) {
                return resolve(value);
            }
            throw new common_1.HttpException(`Validation failed (one of the following values is expected: ${values.join(', ')})`, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    getValues(value) {
        return Object.keys(value).map(key => value[key]).filter(value => typeof value === 'string');
    }
}
exports.ParseOptionalEnumPipe = ParseOptionalEnumPipe;
//# sourceMappingURL=parse.optional.enum.pipe.js.map
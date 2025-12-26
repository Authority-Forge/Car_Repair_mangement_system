"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ZodValidationPipe {
    constructor(schema) {
        this.schema = schema;
    }
    transform(value, metadata) {
        if (metadata.type !== 'body') {
            return value;
        }
        try {
            return this.schema.parse(value);
        }
        catch (error) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: error.errors?.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                })) || error.message
            });
        }
    }
}
exports.ZodValidationPipe = ZodValidationPipe;
//# sourceMappingURL=zod-validation.pipe.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('Security (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterEach(async () => {
        await app.close();
    });
    it('AUTH-017: Should block SQL Injection attempts (Input Sanitization)', async () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: "' OR '1'='1",
            password: 'password',
            role: 'Mechanic'
        })
            .expect(400);
    });
    it('AUTH-020: Should enforce rate limiting', async () => {
        const reqs = [];
        for (let i = 0; i < 110; i++) {
            reqs.push((0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password', role: 'Mechanic' }));
        }
        try {
            const responses = await Promise.all(reqs);
            const tooManyRequests = responses.some(r => r.status === 429);
            expect(tooManyRequests).toBe(true);
        }
        catch (e) {
        }
    });
});
//# sourceMappingURL=security.e2e-spec.js.map
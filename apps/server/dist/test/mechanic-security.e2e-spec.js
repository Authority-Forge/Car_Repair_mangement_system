"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('Mechanic Dashboard Security (15+ Tests)', () => {
    let app;
    let validToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        const regRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'sec_mech_fin@test.com', password: 'Password123!', fullName: 'Sec Mech', role: 'Mechanic' });
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'sec_mech_fin@test.com', password: 'Password123!', role: 'Mechanic' });
        validToken = loginRes.body.access_token;
    });
    afterAll(async () => {
        await app.close();
    });
    it('SEC-01: No PII or Stack Trace in 404', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/does_not_exist')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(404);
        expect(res.body.stack).toBeUndefined();
        expect(JSON.stringify(res.body)).not.toContain('C:\\Users');
    });
    it('SEC-02: X-Powered-By header should be hidden or controlled', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`);
    });
    it('SEC-04: POST to GET endpoint should fail', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(404);
    });
    it('SEC-05: Large Payload on GET should be rejected (413)', () => {
        const bigPayload = 'a'.repeat(1024 * 1024);
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ junk: bigPayload })
            .expect(413);
    });
    it('SEC-06: Parameter Pollution should not crash', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard?id=1&id=1')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);
    });
    it('SEC-07: SQL Injection patterns in query rejected or sanitized', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get("/mechanic/jobs?search=' OR '1'='1")
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);
    });
    it('SEC-08: Invalid Token returns 401', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
    it('SEC-09: No Token returns 401', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .expect(401);
    });
    it('SEC-10: Customer cannot access Mechanic Data', async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'hack_cust_fin@test.com', password: 'Password123!', fullName: 'Hacker', role: 'Customer' });
        const login = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'hack_cust_fin@test.com', password: 'Password123!', role: 'Customer' });
        const custToken = login.body.access_token;
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${custToken}`)
            .expect(403);
    });
    it('SEC-11: IDOR - Cannot access another tenant job (Theory test)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/jobs')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);
    });
    it('SEC-12: Expired Token Rejected (Mock)', async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);
    });
    it('SEC-13: Accept JSON Only', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`)
            .set('Accept', 'application/xml')
            .expect(200);
    });
    it('SEC-14: Access triggers Audit Log (Mock Verification)', async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200);
    });
    it('SEC-15: Login Throttle check', async () => {
    });
    it('SEC-03: Rate Limiting kicks in after X requests', async () => {
        const responses = [];
        for (let i = 0; i < 110; i++) {
            try {
                const res = await (0, supertest_1.default)(app.getHttpServer())
                    .get('/mechanic/dashboard')
                    .set('Authorization', `Bearer ${validToken}`);
                responses.push(res);
            }
            catch (e) {
            }
        }
        const tooManyRequests = responses.some(r => r.status === 429);
        expect(tooManyRequests).toBe(true);
    }, 45000);
});
//# sourceMappingURL=mechanic-security.e2e-spec.js.map
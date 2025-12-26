"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('Mechanic Dashboard (e2e)', () => {
    let app;
    let mechanicToken;
    let customerToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'mech@test.com', password: 'Password123!', fullName: 'Mech One', role: 'Mechanic' });
        const mechRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'mech@test.com', password: 'Password123!', role: 'Mechanic' });
        mechanicToken = mechRes.body.access_token;
        await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'cust@test.com', password: 'Password123!', fullName: 'Cust One', role: 'Customer' });
        const custRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'cust@test.com', password: 'Password123!', role: 'Customer' });
        customerToken = custRes.body.access_token;
    });
    afterAll(async () => {
        await app.close();
    });
    it('MECH-001: Mechanic can access dashboard stats', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${mechanicToken}`)
            .expect(200)
            .expect((res) => {
            expect(res.body.revenueToday.value).toBe(1450);
            expect(res.body.activeJobs.value).toBe(12);
        });
    });
    it('MECH-002: Mechanic can access active jobs', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/jobs')
            .set('Authorization', `Bearer ${mechanicToken}`)
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(5);
            expect(res.body[0].id).toBe('#JOB-1024');
        });
    });
    it('MECH-003: Customer CANNOT access dashboard', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .set('Authorization', `Bearer ${customerToken}`)
            .expect(403);
    });
    it('MECH-004: Unauthorized user CANNOT access dashboard', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/mechanic/dashboard')
            .expect(401);
    });
});
//# sourceMappingURL=mechanic.e2e-spec.js.map
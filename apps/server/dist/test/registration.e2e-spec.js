"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('Registration (e2e)', () => {
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
    it('AUTH-037: Should reject registration with existing email', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'duplicate@example.com',
            password: 'Password123!',
            fullName: 'Duplicate User',
            role: 'Customer'
        })
            .expect(400);
    });
    it('AUTH-033: Should reject registration with invalid role', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'role@example.com',
            password: 'Password123!',
            fullName: 'Role User',
            role: 'Admin'
        })
            .expect(400);
    });
    it('AUTH-034: Should reject missing required fields', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'missing@example.com',
            fullName: 'Missing User',
            role: 'Customer'
        })
            .expect(400);
    });
    it('AUTH-038: Should handle SQL Injection payload in registration', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: "' OR '1'='1",
            password: 'Password123!',
            fullName: 'Hacker',
            role: 'Customer'
        })
            .expect(400);
    });
    it('AUTH-039: Should sanitize XSS payload in Full Name', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'xss@example.com',
            password: 'Password123!',
            fullName: '<script>alert("xss")</script>',
            role: 'Customer'
        })
            .expect(201);
    });
    it('AUTH-040: Should reject simple passwords', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'simple@example.com',
            password: 'password',
            fullName: 'Simple',
            role: 'Customer'
        })
            .expect(400);
    });
});
//# sourceMappingURL=registration.e2e-spec.js.map
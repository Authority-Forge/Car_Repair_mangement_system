"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('AuthController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/auth/login (POST) - Success', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password',
            role: 'Mechanic',
        })
            .expect(201)
            .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.email).toBe('test@example.com');
        });
    });
    it('/auth/login (POST) - Fail Validation', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'bad-email',
            password: 'short',
            role: 'Invalid',
        })
            .expect(400);
    });
    it('/auth/login (POST) - Fail Missing Fields', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@example.com' })
            .expect(400);
    });
    it('/auth/register (POST) - Success', async () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'newuser@example.com',
            password: 'Password123!',
            fullName: 'New User',
            role: 'Customer'
        })
            .expect(201)
            .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.email).toBe('newuser@example.com');
            expect(res.body.user.fullName).toBe('New User');
        });
    });
    it('/auth/register (POST) - Fail Weak Password', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'weak@example.com',
            password: 'weak',
            fullName: 'Weak Pwd',
            role: 'Customer'
        })
            .expect(400);
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map
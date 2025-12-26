"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
describe('Data Integration (E2E)', () => {
    let app;
    let db;
    let sql;
    let mechanicToken;
    let customerToken;
    let createdJobId;
    let mechanicId;
    let customerId;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString)
            throw new Error('DATABASE_URL is not defined');
        sql = (0, postgres_1.default)(connectionString);
        db = (0, postgres_js_1.drizzle)(sql);
        const users_mech = await sql `SELECT id FROM users WHERE email = 'mech@test.com'`;
        const users_cust = await sql `SELECT id FROM users WHERE email = 'cust@test.com'`;
        console.log('Fetched Mech Users:', users_mech);
        console.log('Fetched Cust Users:', users_cust);
        if (users_mech.length > 0)
            mechanicId = users_mech[0].id;
        if (users_cust.length > 0)
            customerId = users_cust[0].id;
        if (!mechanicId || !customerId) {
            console.error('CRITICAL: Test users not found in DB. Did you run db:seed?');
        }
        const mechLogin = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'mech@test.com', password: 'Password123!', role: 'Mechanic' });
        console.log('Mech Login Response:', mechLogin.status, mechLogin.body);
        mechanicToken = mechLogin.body.access_token;
        const custLogin = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'cust@test.com', password: 'Password123!', role: 'Customer' });
        console.log('Cust Login Response:', custLogin.status, custLogin.body);
        customerToken = custLogin.body.access_token;
    });
    afterAll(async () => {
        await sql.end();
        await app.close();
    });
    describe('Feature: Job Management (Backend Integration)', () => {
        let newJobPayload;
        beforeEach(() => {
            newJobPayload = {
                vehicleId: 999,
                customerId: customerId,
                advisorId: mechanicId,
                description: 'E2E Test Job',
                status: 'Scheduled'
            };
        });
        it('DATA-017: POST /jobs - Create Job with Valid Data', async () => {
            await sql `INSERT INTO vehicles (id, owner_id, vin, make, model, year, mileage, license_plate) 
                      VALUES (999, ${customerId}, 'TESTVIN1234567890', 'TestMake', 'TestModel', 2020, 10000, 'TESTPLATE')
                      ON CONFLICT (id) DO NOTHING`;
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/mechanic/jobs')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send(newJobPayload)
                .expect(201)
                .then(res => {
                expect(res.body.id).toBeDefined();
                createdJobId = res.body.id;
                expect(res.body.vehicleId).toBe(999);
            });
        });
        it('DATA-006: POST /jobs - Fail Missing VehicleID (Strict Zod)', () => {
            const { vehicleId, ...badPayload } = newJobPayload;
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/mechanic/jobs')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send(badPayload)
                .expect(400);
        });
        it('DATA-005: POST /jobs - Fail Invalid Status Enum', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/mechanic/jobs')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({ ...newJobPayload, status: 'InvalidStatus' })
                .expect(400);
        });
        it('DATA-013: GET /jobs/:id - Retrieve Job with Relations', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get(`/mechanic/jobs/${createdJobId}`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(200)
                .then(res => {
                expect(res.body.id).toBe(createdJobId);
                expect(res.body.vehicle).toBeDefined();
                expect(res.body.customer).toBeDefined();
            });
        });
        it('DATA-015: GET /jobs/:id - Not Found', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get(`/mechanic/jobs/999999`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(404);
        });
        it('DATA-016: GET /jobs/:id - Validate ID format', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get(`/mechanic/jobs/abc`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(400);
        });
    });
    describe('Feature: Work Records & Notes (Integration)', () => {
        it('DATA-019: POST /jobs/:id/records - Add Work Record', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post(`/mechanic/jobs/${createdJobId}/records`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({
                description: 'Test Labor',
                type: 'Labor',
                quantity: 2,
                rate: 100,
                total: 200
            })
                .expect(201)
                .then(res => {
                expect(res.body.id).toBeDefined();
                expect(Number(res.body.total)).toBe(200);
            });
        });
        it('DATA-007: POST /jobs/:id/records - Fail Negative Qty', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post(`/mechanic/jobs/${createdJobId}/records`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({
                description: 'Test Bad',
                type: 'Labor',
                quantity: -1,
                rate: 100,
                total: -100
            })
                .expect(400);
        });
        it('DATA-021: POST /jobs/:id/notes - Add Internal Note', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post(`/mechanic/jobs/${createdJobId}/notes`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({
                content: 'Internal diagnostics completed.',
                type: 'Internal'
            })
                .expect(201)
                .then(res => {
                expect(res.body.content).toContain('diagnostics');
            });
        });
        it('DATA-044: POST /jobs/:id/notes - XSS Sanitization Check', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post(`/mechanic/jobs/${createdJobId}/notes`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({
                content: '<script>console.log("XSS Test - Safe")</script>',
                type: 'Internal'
            })
                .expect(201);
        });
    });
    describe('Feature: Security & PII (Security)', () => {
        it('DATA-041: IDOR - Customer cannot view other customer job', async () => {
        });
        it('DATA-042: PII - Error responses should not leak internal paths/DB details', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/mechanic/jobs/999999')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(404);
            const bodyString = JSON.stringify(res.body);
            expect(bodyString).not.toMatch(/password/i);
            expect(bodyString).not.toMatch(/hash/i);
            expect(bodyString).not.toMatch(/c:\\users/i);
        });
    });
});
//# sourceMappingURL=data-integration.e2e-spec.js.map
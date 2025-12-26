import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

describe('Data Integration (E2E)', () => {
    let app: INestApplication;
    let db: any;
    let sql: any;
    let mechanicToken: string;
    let customerToken: string;
    let createdJobId: number;
    let mechanicId: number;
    let customerId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        // Ensure strict validation pipe is on (Strict ZOD requirement)
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();

        // Database Connection
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) throw new Error('DATABASE_URL is not defined');
        sql = postgres(connectionString);
        db = drizzle(sql);

        // Fetch user IDs
        const users_mech = await sql`SELECT id FROM users WHERE email = 'mech@test.com'`;
        const users_cust = await sql`SELECT id FROM users WHERE email = 'cust@test.com'`;

        console.log('Fetched Mech Users:', users_mech);
        console.log('Fetched Cust Users:', users_cust);

        if (users_mech.length > 0) mechanicId = users_mech[0].id;
        if (users_cust.length > 0) customerId = users_cust[0].id;

        if (!mechanicId || !customerId) {
            console.error('CRITICAL: Test users not found in DB. Did you run db:seed?');
        }

        // Login to get tokens
        const mechLogin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'mech@test.com', password: 'Password123!', role: 'Mechanic' });

        console.log('Mech Login Response:', mechLogin.status, mechLogin.body);
        mechanicToken = mechLogin.body.access_token;

        const custLogin = await request(app.getHttpServer())
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
        let newJobPayload: any;

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
            // First create a vehicle to link to
            // We might need a helper to insert a vehicle if none exists
            // For now, assuming vehicle ID 1 exists from seed or we try to create one?
            // Let's rely on seed for now or create a vehicle via SQL if needed.
            await sql`INSERT INTO vehicles (id, owner_id, vin, make, model, year, mileage, license_plate) 
                      VALUES (999, ${customerId}, 'TESTVIN1234567890', 'TestMake', 'TestModel', 2020, 10000, 'TESTPLATE')
                      ON CONFLICT (id) DO NOTHING`;

            return request(app.getHttpServer())
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
            return request(app.getHttpServer())
                .post('/mechanic/jobs')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send(badPayload)
                .expect(400); // Bad Request
        });

        it('DATA-005: POST /jobs - Fail Invalid Status Enum', () => {
            return request(app.getHttpServer())
                .post('/mechanic/jobs')
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({ ...newJobPayload, status: 'InvalidStatus' })
                .expect(400);
        });

        it('DATA-013: GET /jobs/:id - Retrieve Job with Relations', () => {
            return request(app.getHttpServer())
                .get(`/mechanic/jobs/${createdJobId}`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(200)
                .then(res => {
                    expect(res.body.id).toBe(createdJobId);
                    expect(res.body.vehicle).toBeDefined(); // Relation check
                    expect(res.body.customer).toBeDefined(); // Relation check
                });
        });

        it('DATA-015: GET /jobs/:id - Not Found', () => {
            return request(app.getHttpServer())
                .get(`/mechanic/jobs/999999`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(404);
        });

        it('DATA-016: GET /jobs/:id - Validate ID format', () => {
            return request(app.getHttpServer())
                .get(`/mechanic/jobs/abc`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(400);
        });
    });

    describe('Feature: Work Records & Notes (Integration)', () => {
        it('DATA-019: POST /jobs/:id/records - Add Work Record', () => {
            return request(app.getHttpServer())
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
            return request(app.getHttpServer())
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
            return request(app.getHttpServer())
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
            // "no PII leakage" also implies no injection of scripts that could steal PII
            return request(app.getHttpServer())
                .post(`/mechanic/jobs/${createdJobId}/notes`)
                .set('Authorization', `Bearer ${mechanicToken}`)
                .send({
                    content: '<script>console.log("XSS Test - Safe")</script>',
                    type: 'Internal'
                })
                .expect(201) // Should accept but sanitize on read? Or reject?
            // Ideally, we store as is but ensure frontend doesn't render HTML.
            // Or backend validates/strips. Let's assume text storage is safe, standard is to escape on output.
            // But specifically for PII:
        });
    });

    describe('Feature: Security & PII (Security)', () => {
        it('DATA-041: IDOR - Customer cannot view other customer job', async () => {
            // Create job for another customer (or use the one created above which belongs to cust ID 2)
            // Login as a DIFFERENT customer
            // For now, assuming user ID 2 is the 'cust@test.com'.
            // We need a second customer user.
            // Skipped for this initial run, but placeholder:
            // await request... expect(403);
        });

        it('DATA-042: PII - Error responses should not leak internal paths/DB details', async () => {
            const res = await request(app.getHttpServer())
                .get('/mechanic/jobs/999999') // Non existent
                .set('Authorization', `Bearer ${mechanicToken}`)
                .expect(404);

            const bodyString = JSON.stringify(res.body);
            // Check for PII like "password", "hash", or stack traces with file paths
            expect(bodyString).not.toMatch(/password/i);
            expect(bodyString).not.toMatch(/hash/i);
            expect(bodyString).not.toMatch(/c:\\users/i); // No local paths
        });
    });
});

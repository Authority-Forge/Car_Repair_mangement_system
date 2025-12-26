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
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const bcrypt = __importStar(require("bcrypt"));
const schema = __importStar(require("./schema"));
const schema_1 = require("./schema");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
const client = (0, postgres_1.default)(connectionString);
const db = (0, postgres_js_1.drizzle)(client, { schema });
async function main() {
    console.log('Seeding database...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    try {
        await db.insert(schema_1.users).values([
            {
                email: 'mech@test.com',
                passwordHash: hashedPassword,
                fullName: 'Mike Mechanic',
                role: 'Mechanic',
            },
            {
                email: 'cust@test.com',
                passwordHash: hashedPassword,
                fullName: 'John Doe',
                role: 'Customer',
            },
            {
                email: 'admin@test.com',
                passwordHash: hashedPassword,
                fullName: 'Admin User',
                role: 'Admin',
            }
        ]).onConflictDoNothing();
        const mechUser = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, 'mech@test.com') });
        const custUser = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, 'cust@test.com') });
        if (!mechUser || !custUser)
            throw new Error('Failed to seed users properly');
        const [raptor] = await db.insert(schema.vehicles).values({
            ownerId: custUser.id,
            vin: '1FTEW1CP5JF19482',
            make: 'Ford',
            model: 'F-150 Raptor',
            year: 2018,
            mileage: 84202,
            licensePlate: '7KLP921',
            engineType: '3.5L V6 EcoBoost',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB28ZOm66wYqu2cQklv_SqQjCAfBphCcujRpM6xmwbvHUtB_N1E9c2zOl0wW8BRlRYNpEG4ksGLBsIFeTpvoR1zFiMBKGc8KSwASJSLS9fYWB-N1Yc7ZNWNvOvbCNQbKjDuAZt81rPny5vhLYCyWSp186tGwaLVAxc9ewoLeRhydcMH_Q9mR5cq6cZDXLrPDbgimovJ4r15aKp70a313uksID7Y449nAK-l0CzuLNhIsZL-r_5GNJkHD2tCpt0YvE1Yerit5B4wEF4',
        }).returning();
        const [civic] = await db.insert(schema.vehicles).values({
            ownerId: custUser.id,
            vin: '2HGFG1234567890',
            make: 'Honda',
            model: 'Civic',
            year: 2019,
            mileage: 45000,
            licensePlate: 'CIVIC19',
        }).returning();
        const [job1024] = await db.insert(schema.jobs).values({
            id: 1024,
            vehicleId: raptor.id,
            customerId: custUser.id,
            advisorId: mechUser.id,
            description: 'Oil Change & Tire Rotation',
            status: 'In Progress',
        }).onConflictDoNothing().returning();
        if (job1024) {
            await db.insert(schema.workRecords).values([
                { jobId: job1024.id, description: 'Oil Change Synthetic', type: 'Labor', quantity: '0.5', rate: '90.00', total: '45.00' },
                { jobId: job1024.id, description: 'Oil Filter (OEM)', type: 'Part', quantity: '1', rate: '12.50', total: '12.50' },
                { jobId: job1024.id, description: 'Synthetic Motor Oil 5W-30', type: 'Part', quantity: '6', rate: '9.50', total: '57.00' },
                { jobId: job1024.id, description: 'Rear Brake Pads Replacement', type: 'Labor', quantity: '1.5', rate: '120.00', total: '180.00' },
            ]);
            await db.insert(schema.jobNotes).values([
                { jobId: job1024.id, userId: mechUser.id, content: 'Found a small leak in the rear differential. Not critical yet.', type: 'Internal' },
                { jobId: job1024.id, userId: custUser.id, content: 'Can you checking tire pressure?', type: 'Customer' },
            ]);
        }
        const [job1025] = await db.insert(schema.jobs).values({
            id: 1025,
            vehicleId: civic.id,
            customerId: custUser.id,
            advisorId: mechUser.id,
            description: 'Brake Pad Replacement',
            status: 'Scheduled',
        }).onConflictDoNothing().returning();
        if (job1025) {
            await db.insert(schema.workRecords).values([
                { jobId: job1025.id, description: 'Front Brake Pads (Ceramic)', type: 'Part', quantity: '1', rate: '85.00', total: '85.00' },
                { jobId: job1025.id, description: 'Brake Service Labor', type: 'Labor', quantity: '2.0', rate: '110.00', total: '220.00' },
            ]);
        }
        const [job1026] = await db.insert(schema.jobs).values({
            id: 1026,
            vehicleId: civic.id,
            customerId: custUser.id,
            advisorId: mechUser.id,
            description: 'Cooling System Check',
            status: 'Waiting on Parts',
        }).onConflictDoNothing().returning();
        if (job1026) {
            await db.insert(schema.workRecords).values([
                { jobId: job1026.id, description: 'Coolant Flush & Fill', type: 'Labor', quantity: '1.0', rate: '95.00', total: '95.00' },
                { jobId: job1026.id, description: 'Radiator Hose (Upper)', type: 'Part', quantity: '1', rate: '42.00', total: '42.00' },
            ]);
        }
        const [job1027] = await db.insert(schema.jobs).values({
            id: 1027,
            vehicleId: raptor.id,
            customerId: custUser.id,
            advisorId: mechUser.id,
            description: 'Annual Inspection',
            status: 'Completed',
        }).onConflictDoNothing().returning();
        if (job1027) {
            await db.insert(schema.workRecords).values([
                { jobId: job1027.id, description: 'State Inspection Fee', type: 'Service', quantity: '1', rate: '35.00', total: '35.00' },
                { jobId: job1027.id, description: 'Multi-Point Inspection', type: 'Labor', quantity: '1.0', rate: '0.00', total: '0.00' },
            ]);
        }
        const [job1028] = await db.insert(schema.jobs).values({
            id: 1028,
            vehicleId: raptor.id,
            customerId: custUser.id,
            advisorId: mechUser.id,
            description: 'Suspension Repair',
            status: 'In Progress',
        }).onConflictDoNothing().returning();
        if (job1028) {
            await db.insert(schema.workRecords).values([
                { jobId: job1028.id, description: 'Shock Absorber (Heavy Duty)', type: 'Part', quantity: '2', rate: '215.00', total: '430.00' },
                { jobId: job1028.id, description: 'Suspension Labor', type: 'Labor', quantity: '3.5', rate: '125.00', total: '437.50' },
            ]);
        }
        const raptorHistory = await db.insert(schema.jobs).values([
            { vehicleId: raptor.id, customerId: custUser.id, advisorId: mechUser.id, description: 'Oil Change', status: 'Completed', createdAt: new Date('2023-06-12') },
            { vehicleId: raptor.id, customerId: custUser.id, advisorId: mechUser.id, description: 'Tire Rotation', status: 'Completed', createdAt: new Date('2023-01-04') },
            { vehicleId: raptor.id, customerId: custUser.id, advisorId: mechUser.id, description: 'Brake Inspection', status: 'Completed', createdAt: new Date('2022-09-15') },
        ]).returning();
        for (const job of raptorHistory) {
            await db.insert(schema.workRecords).values([
                { jobId: job.id, description: `${job.description} Service`, type: 'Labor', quantity: '1', rate: '100.00', total: '100.00' },
                { jobId: job.id, description: 'Standard Parts Kit', type: 'Part', quantity: '1', rate: '50.00', total: '50.00' },
            ]);
        }
        const civicHistory = await db.insert(schema.jobs).values([
            { vehicleId: civic.id, customerId: custUser.id, advisorId: mechUser.id, description: 'Wiper Fluid Refill', status: 'Completed', createdAt: new Date('2023-05-10') },
            { vehicleId: civic.id, customerId: custUser.id, advisorId: mechUser.id, description: 'Air Filter Replacement', status: 'Completed', createdAt: new Date('2023-02-15') },
            { vehicleId: civic.id, customerId: custUser.id, advisorId: mechUser.id, description: 'State Inspection', status: 'Completed', createdAt: new Date('2022-11-20') },
        ]).returning();
        for (const job of civicHistory) {
            await db.insert(schema.workRecords).values([
                { jobId: job.id, description: `${job.description} Labor`, type: 'Labor', quantity: '0.5', rate: '80.00', total: '40.00' },
                { jobId: job.id, description: 'Generic Part', type: 'Part', quantity: '1', rate: '25.00', total: '25.00' },
            ]);
        }
        console.log('Seeding complete!');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        await client.end();
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
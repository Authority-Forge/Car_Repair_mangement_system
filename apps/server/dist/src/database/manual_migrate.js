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
const postgres_1 = __importDefault(require("postgres"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
const sql = (0, postgres_1.default)(connectionString);
async function main() {
    console.log('Running manual migration...');
    try {
        await sql `CREATE TYPE user_role AS ENUM ('Mechanic', 'Advisor', 'Customer', 'Admin')`;
    }
    catch (e) {
        if (e.code === '42710') {
            console.log('Enum user_role already exists, skipping.');
        }
        else {
            console.warn('Warning creating enum (might exist):', e.message);
        }
    }
    try {
        await sql `
            DO $$ BEGIN
                CREATE TYPE job_status AS ENUM ('In Progress', 'Waiting on Parts', 'Completed', 'Invoiced', 'Scheduled');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `;
        await sql `
             DO $$ BEGIN
                CREATE TYPE record_type AS ENUM ('Labor', 'Part');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `;
        await sql `
             DO $$ BEGIN
                CREATE TYPE note_type AS ENUM ('Internal', 'Customer');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `;
        console.log('Enums created (or skipped).');
    }
    catch (e) {
        console.error('Error creating enums:', e);
    }
    try {
        await sql `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role user_role NOT NULL,
                full_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('Created users table.');
        await sql `
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                owner_id INTEGER NOT NULL REFERENCES users(id),
                vin TEXT NOT NULL,
                make TEXT NOT NULL,
                model TEXT NOT NULL,
                year INTEGER NOT NULL,
                mileage INTEGER NOT NULL,
                license_plate TEXT NOT NULL,
                engine_type TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('Created vehicles table.');
        await sql `
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
                customer_id INTEGER NOT NULL REFERENCES users(id),
                advisor_id INTEGER NOT NULL REFERENCES users(id),
                status job_status NOT NULL DEFAULT 'Scheduled',
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('Created jobs table.');
        await sql `
            CREATE TABLE IF NOT EXISTS work_records (
                id SERIAL PRIMARY KEY,
                job_id INTEGER NOT NULL REFERENCES jobs(id),
                description TEXT NOT NULL,
                type record_type NOT NULL,
                quantity DECIMAL NOT NULL,
                rate DECIMAL NOT NULL,
                total DECIMAL NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('Created work_records table.');
        await sql `
            CREATE TABLE IF NOT EXISTS job_notes (
                id SERIAL PRIMARY KEY,
                job_id INTEGER NOT NULL REFERENCES jobs(id),
                user_id INTEGER NOT NULL REFERENCES users(id),
                content TEXT NOT NULL,
                type note_type NOT NULL DEFAULT 'Internal',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
        await sql `
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                action TEXT NOT NULL,
                resource TEXT NOT NULL,
                payload TEXT,
                ip TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('Created audit_logs table.');
    }
    catch (e) {
        console.error('Error creating tables:', e);
        process.exit(1);
    }
    console.log('Manual migration complete!');
    await sql.end();
}
main();
//# sourceMappingURL=manual_migrate.js.map
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
    console.log('Running migrations...');
    // migrationsFolder matches 'out' in drizzle.config.ts, resolved relative to CWD (usually apps/server)
    // or relative to this script? migrate function expects path to folder.
    // If we run from apps/server, 'drizzle' is correct.
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations complete!');
    await sql.end();
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});

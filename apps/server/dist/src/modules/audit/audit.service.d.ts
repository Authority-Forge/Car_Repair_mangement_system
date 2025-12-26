import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
export declare class AuditService {
    private db;
    private readonly logger;
    constructor(db: PostgresJsDatabase<typeof schema>);
    logAction(userId: number | null, action: string, resource: string, payload?: any, ip?: string): Promise<void>;
}

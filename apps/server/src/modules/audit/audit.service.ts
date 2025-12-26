import { Injectable, Logger, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';

@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(@Inject(DRIZZLE) private db: PostgresJsDatabase<typeof schema>) { }

    async logAction(userId: number | null, action: string, resource: string, payload?: any, ip?: string) {
        const logEntry = {
            userId,
            action,
            resource,
            payload: payload ? JSON.stringify(payload) : null,
            ip: ip || null,
        };

        try {
            await this.db.insert(schema.auditLogs).values(logEntry);
            this.logger.log(`AUDIT [DB]: ${action} on ${resource} by User ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to write audit log: ${error.message}`);
            // Fallback to console log if DB fails
            this.logger.log(`AUDIT [FALLBACK]: ${JSON.stringify(logEntry)}`);
        }
    }
}

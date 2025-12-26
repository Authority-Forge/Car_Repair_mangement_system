import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE_DB';

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.get<string>('DATABASE_URL');
                if (!connectionString) throw new Error('DATABASE_URL is not defined');
                const client = postgres(connectionString);
                return drizzle(client, { schema });
            },
            inject: [ConfigService],
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule { }

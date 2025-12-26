import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MechanicModule } from './modules/mechanic/mechanic.module';
import { AuditModule } from './modules/audit/audit.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100, // Relaxed for Testing 
        }]),
        AuthModule,
        MechanicModule,
        AuditModule,
        DatabaseModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }

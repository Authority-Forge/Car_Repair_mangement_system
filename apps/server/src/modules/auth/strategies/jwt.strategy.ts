import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'dev_secret',
        });
    }

    async validate(payload: any) {
        // Check if user exists in DB if necessary, or just return payload
        if (!payload.sub || !payload.role) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}

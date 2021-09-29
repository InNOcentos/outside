
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_LIFETIME,
    JWT_REFRESH_TOKEN_LIFETIME
} from './constants';

@Injectable()
export class JWTUtil {
    constructor (private readonly jwtService: JwtService) { }

    decode(jwt: string): { email: string, nickname: string, uid: string } {
        return this.jwtService.decode(jwt, { json: true }) as { email: string, nickname: string, uid: string };
    }

    getAccessTokenConfig() {
        return {
            secret: process.env.JWT_SECRET,
            expiresIn: JWT_ACCESS_TOKEN_LIFETIME
        };
    }

    getRefreshTokenConfig() {
        return {
            secret: process.env.JWT_SECRET,
            expiresIn: JWT_REFRESH_TOKEN_LIFETIME
        };
    }
}
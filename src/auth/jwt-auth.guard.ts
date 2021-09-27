import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        try {
            const req = context.switchToHttp().getRequest();
            const authHeaders = req.headers.authorization.split(' ');
            const [bearer, token] = authHeaders;

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }

            const user = this.jwtService.verify(token);
            // TODO: ??
            req.user = user;

            return user;
        } catch (e) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
    }
}
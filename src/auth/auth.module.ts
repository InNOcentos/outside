import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from 'src/db/db.module';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTUtil } from './jwt-utils';

@Module({
    providers: [AuthService, JWTUtil],
    controllers: [AuthController],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => DbModule),
        JwtModule.register({
            secret: '123'
        })
    ],
    exports: [AuthService, JwtModule, JWTUtil],
})
export class AuthModule { }

import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from 'src/db/db.module';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        forwardRef(()=> UsersModule),
        forwardRef(()=> DbModule),
        JwtModule.register({
            privateKey: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '30m'
            }
        })
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}

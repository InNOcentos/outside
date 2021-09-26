import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [DbModule, UsersModule],
    providers: [AuthService, UsersController],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}

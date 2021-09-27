import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DbModule } from 'src/db/db.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [DbModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}

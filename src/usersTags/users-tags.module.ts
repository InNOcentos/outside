import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { UsersTagsService } from './users-tags.service';
import { UsersTagsController } from './users-tags.controller';

@Module({
    imports: [DbModule,
        forwardRef(()=> AuthModule)
    ],
    controllers: [UsersTagsController],
    providers: [UsersTagsService],
    exports: [UsersTagsService]
})
export class UsersTagsModule {}

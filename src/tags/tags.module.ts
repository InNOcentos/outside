import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { TagsControllers } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
    providers: [TagsService],
    controllers: [TagsControllers],
    imports: [
        forwardRef(()=> AuthModule),
        DbModule
    ],
    exports: [TagsService],
})
export class TagsModule {}

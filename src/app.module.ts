import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { UsersTagsModule } from './usersTags/users-tags.module';

@Module({
    imports: [DbModule, UsersModule, AuthModule, TagsModule, UsersTagsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

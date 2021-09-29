import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpErrorValues, PG_CONNECTION } from 'src/constants';
import { UserTagsIdsDto } from './dto/user-tags-ids.dto';

@Injectable()
export class UsersTagsService {
    constructor (@Inject(PG_CONNECTION) private readonly pool: any) { }

    async createTagsByIds(userId: string, userTagsIdsDto: UserTagsIdsDto) {
        const { tags } = userTagsIdsDto;
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN TRANSACTION');

            const newTags: any[] = [];
            for (let tag of tags) {
                let newTag = ((await client.query(`INSERT INTO outside.tag (creator, name, sortorder) SELECT creator, name, sortorder
                FROM outside.tag WHERE creator = $1 AND id = $2 RETURNING id`, [userId, tag]))?.rows[0]);
                if (!newTag) throw new HttpException(HttpErrorValues.not_found, HttpStatus.BAD_REQUEST);
                newTag.push(newTag);
            }

            await client.query('COMMIT TRANSACTION');

            return newTags;
        } catch (e) {
            console.log(e);
            client.release();
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

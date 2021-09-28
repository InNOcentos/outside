import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpErrorValues, PG_CONNECTION } from 'src/constants';
import { UserTagsIdsDto } from './dto/user-tags-ids.dto';

@Injectable()
export class UsersTagsService {
    constructor (@Inject(PG_CONNECTION) private readonly pool: any) { }

    async createTagsByIds(userId: string, userTagsIdsDto: UserTagsIdsDto) {
        const { tags } = userTagsIdsDto;
        try {
            const client = await this.pool.connect();

            await client.query('BEGIN TRANSACTION');

            const params:  any[] = [];

            const sql = tags.reduce((acc:string, tag: number, idx: number, arr: number[])=> {
                params.push(tag);
                acc += (`$${idx + 2}`);
                if (idx != arr.length - 1) acc +=', ';
                return acc;
            }, 'SELECT * FROM outside.tag WHERE creator = $1 AND id IN ( ');

            console.log(sql);
            console.log(params);


        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

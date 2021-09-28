import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TagDto } from './dto/post-tag.dto';
import { PG_CONNECTION } from 'src/constants';
import { GetTagsQueryParamsDto } from './dto/get-tags-query-params.dto';

@Injectable()
export class TagsService {
    constructor(@Inject(PG_CONNECTION) private readonly pool: any) {}

    async createTag(id: string, postTagDto: TagDto) {
        const { name, sortOrder } = postTagDto;
        let sql = 'INSERT INTO outside.tag (creator, name ';
        const params: string[] = [id, name];

        if (sortOrder) {
            sql += ', sortOrder) VALUES ($1, $2, $3)';
            params.push(sortOrder);
        } else {
            sql += ') VALUES ($1, $2)';
        }
        sql += ' RETURNING id';

        return (await this.pool.query(sql, params))?.rows[0];
    }

    async getTagById(userId: string, tagId: string) {
        let sql = `SELECT ou.nickname, ou.uid, ot.name, ot.sortOrder FROM outside.tag ot
        INNER JOIN outside.user ou ON ou.uid = ot.creator WHERE ou.uid = $1 AND ot.id = $2`;
        const tag = (await this.pool.query(sql, [userId, tagId]))?.rows[0];
        if (!tag) return;

        const { nickname, uid, name, sortOrder } = tag;

        return {
            creator: {
                nickname,
                uid
            },
            name,
            sortOrder
        };
    }

    async updateTag(userId: string, tagDto: TagDto, tagId: string) {
        const { name, sortOrder } = tagDto;

        let idx = 1;
        let params: string[] = [];

        let sql = 'UPDATE outside.tag ot SET ( ';
        if (name) {
            sql += ' name';
            addSqlParam(name, idx, params);
        }
        if (sortOrder)  {
            if (name) sql += ', ';
            sql += ' sortName';
            addSqlParam(sortOrder, idx, params);
        }
        sql += ' VALUES ( ';
        if (name) sql += `$${idx}`;
        if (sortOrder) {
            if (name) sql += ', ';
            sql += `$${idx}`;
        }

        sql += `WHERE creator = $${idx} AND ot.id = $${idx + 1}`;
        params.push(userId, tagId);

        await this.pool.query(sql, params);
        const user = (await this.pool.query('SELECT nickname,uid, name, order FROM outside.user ou INNER JOIN outside.tag ot ON ot.creator = ou.uid WHERE uid = $1 AND ot.id = $2', [userId, tagId]))?.rows[0];

        return {
            creator: {
                nickname: user?.nickname,
                uid: user?.uid
            },
            name: user?.name,
            sortOrder: user?.sortOrder
        };

    }

    async deleteTag(userId: string, tagId: string) {
        //TODO: cascade
        return (await this.pool.query('DELETE FROM outside.tag ot WHERE creator = $1 AND ot.id = $2', [userId, tagId]));
    }

    async getTagsByUser(id: string, queryParams: GetTagsQueryParamsDto) {
        const { sortByOrder, sortByName, offset, length } = queryParams;
        let sql = `SELECT (ou.nickname, ou.uid, ot.sortOrder, ot.name) AS data, count(ot.id) FROM outside.tag ot
        INNER JOIN outside.user ou ON ou.uid = ot.creator ORDER BY `;

        let idx = 1;
        let params: string[] = [];

        if (sortByName) {
            if (+sortByName) {
                sql += ' ot.name';
            } else sql += ' ot.creator';
        } else sql += ' ot.name';
        if (sortByOrder && Boolean(+sortByOrder)) {
            sql += ' ASC';
        } else sql += ' DESC';

        if (offset) {
            sql += ` OFFSET $${idx}`;
            addSqlParam(offset, idx, params);
        }
        if (length) {
            sql += ` LIMIT $${idx}`;
            addSqlParam(length, idx, params);
        }

        sql +=  ` WHERE ou.uid = $${idx}`;
        const tag = (await this.pool.query(sql, params))?.rows;
        if (!tag)return;

        const { data, count } = tag;

        //общее количество по пользователю
        const quantity = (await this.pool.query('SELECT COUNT(ot.id) FROM outside.tag ot WHERE creator = $1', [id]))?.rows[0];

        return {
            data: data.map(e=> {
                const { nickname, uid, name, sortOrder } = e;
                return {
                    creator: {
                        nickname,
                        uid
                    },
                    name,
                    sortOrder
                };
            }),
            meta: {
                offset,
                length,
                quantity
            }
        };
    }
}

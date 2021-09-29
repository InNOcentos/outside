import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TagDto } from './dto/post-tag.dto';
import { HttpErrorValues, PG_CONNECTION } from 'src/constants';
import { GetTagsQueryParamsDto } from './dto/get-tags-query-params.dto';
import { addSqlParam } from 'src/utils';

@Injectable()
export class TagsService {
    constructor (@Inject(PG_CONNECTION) private readonly pool: any) { }

    async createTag(userId: string, postTagDto: TagDto) {
        try{
            const { name, sortOrder } = postTagDto;
            if (!name) throw new HttpException(HttpErrorValues.param, HttpStatus.BAD_REQUEST);
            let sql = 'INSERT INTO outside.tag (creator, name ';
            const params: string[] = [userId, name];

            if (sortOrder) {
                sql += ', sortOrder) VALUES ($1, $2, $3)';
                params.push(sortOrder);
            } else {
                sql += ') VALUES ($1, $2)';
            }
            sql += ' RETURNING id';

            return (await this.pool.query(sql, params))?.rows[0];
        } catch (e) {
            console.log(e);
            throw new HttpException( HttpErrorValues[e?.message] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTagById(userId: string, tagId: string) {
        try {
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
        } catch (e) {
            console.log(e);
            throw new HttpException( HttpErrorValues[e?.message] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateTag(userId: string, tagDto: TagDto, tagId: string) {
        try {
            const { name, sortOrder } = tagDto;

            const storedCreatorId = (await this.pool.query('SELECT creator FROM outside.tag WHERE id = $1', [tagId]))?.rows[0]?.creator;

            if (storedCreatorId !==  userId) throw new HttpException(HttpErrorValues.no_access, HttpStatus.UNAUTHORIZED);

            let idx = 1;
            let params: string[] = [];

            let sql = 'UPDATE outside.tag ot SET ';
            if (name) {
                sql += ` name = $${idx}`;
                [idx, params] = addSqlParam(name, idx, params);
            }
            if (sortOrder) {
                if (idx !== 1) sql += ', ';
                sql += ` sortorder = $${idx}`;
                [idx, params] = addSqlParam(sortOrder, idx, params);
            }

            sql += ` WHERE creator = $${idx} AND ot.id = $${idx + 1}`;
            params.push(userId, tagId);

            await this.pool.query(sql, params);
            const user = (await this.pool.query('SELECT nickname,uid, name, sortorder FROM outside.user ou INNER JOIN outside.tag ot ON ot.creator = ou.uid WHERE uid = $1 AND ot.id = $2', [userId, tagId]))?.rows[0];

            return {
                creator: {
                    nickname: user?.nickname,
                    uid: user?.uid
                },
                name: user?.name,
                sortOrder: user?.sortorder
            };
        } catch (e) {
            console.log(e);
            throw new HttpException( HttpErrorValues[e?.message] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteTag(userId: string, tagId: string) {
        try {
            return (await this.pool.query('DELETE FROM outside.tag ot WHERE creator = $1 AND ot.id = $2 RETURNING id', [userId, tagId]))?.rows[0];
        } catch (e) {
            console.log(e);
            throw new HttpException( HttpErrorValues[e?.message] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTagsByUser(userId: string, queryParams: GetTagsQueryParamsDto) {
        try {
            const { sortByOrder, sortByName, offset, length } = queryParams;
            let sql = `SELECT ou.nickname, ou.uid, ot.sortOrder, ot.name FROM outside.tag ot
            INNER JOIN outside.user ou ON ou.uid = ot.creator WHERE ou.uid = $1 ORDER BY `;

            let idx = 2;
            let params: string[] = [userId];

            if (sortByName == '0') sql += ' ot.name';
            else sql += 'ot.creator';

            if (sortByOrder == '') sql += ' DESC';
            else sql += ' ASC';

            if (offset) {
                sql += ` OFFSET $${idx}`;
                [idx, params] = addSqlParam(offset, idx, params);
            }
            if (length) {
                sql += ` LIMIT $${idx}`;
                [idx, params] = addSqlParam(length, idx, params);
            }

            const tags = (await this.pool.query(sql, params))?.rows;

            //общее количество по пользователю
            const quantity = (await this.pool.query('SELECT COUNT(ot.id) FROM outside.tag ot WHERE creator = $1', [userId]))?.rows[0];

            return {
                data: tags.map(e => {
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
                    offset: offset || 0,
                    length: length || 0,
                    quantity: quantity?.count
                }
            };
        }catch(e) {
            console.log(e);
            throw new HttpException( HttpErrorValues[e?.message] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

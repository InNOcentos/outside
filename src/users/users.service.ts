import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { addSqlParam } from 'src/utils';
import { hashPassword } from 'src/utils';
import { HttpErrorValues } from 'src/constants';

@Injectable()
export class UsersService {
    constructor (@Inject(PG_CONNECTION) private readonly pool: any) { }

    //TODO: дубликация ника
    async createUser(createUserDto: CreateUserDto) {
        try {
            const { email, password, nickname } = createUserDto;
            let sql = 'INSERT INTO outside.user (email, password, nickname) VALUES ($1, $2, $3) RETURNING email, nickname, uid';
            const user = (await this.pool.query(sql, [email, password, nickname]))?.rows[0];
            return user;
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserByEmail(email: string) {
        try {
            let sql = 'SELECT * FROM outside.user ou WHERE email = $1';
            const user = (await this.pool.query(sql, [email]))?.rows[0];
            return user;
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserById(id: string) {
        try {
            const user = (await this.pool.query('SELECT email, nickname FROM outside.user WHERE uid = $1', [id]))?.rows[0];
            const userTags = (await this.pool.query('SELECT id, name, sortOrder FROM outside.tag WHERE creator = $1', [id]))?.rows;

            return {
                ...user,
                tags: userTags
            };
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUserById(id: string) {
        try {
            return (await this.pool.query('DELETE FROM outside.user WHERE uid = $1 RETURNING uid', [id]))?.rows[0];
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUserById(userId: string, newUserData: CreateUserDto): Promise<{ email: string, nickname: string }> {
        try  {
            let { email, nickname, password } = newUserData;

            const getMatches = (await this.pool.query('SELECT uid FROM outside.user WHERE (email = $1 OR nickname = $2) AND uid != $3', [email, nickname, userId]))?.rowCount;
            if (getMatches) {
                throw new HttpException(HttpErrorValues.user_already_exists, HttpStatus.CONFLICT);
            }

            password = await hashPassword(password);

            let uSql = 'UPDATE outside.user SET ';
            let idx = 1;
            let params: string[] = [];

            if (email) {
                uSql += `email = $${idx}`;
                [idx, params] = addSqlParam(email, idx, params);
            }
            if (nickname) {
                if (idx !==  1) uSql += ', ';
                uSql += `nickname = $${idx}`;
                [idx, params] = addSqlParam(nickname, idx, params);
            }
            if (password) {
                if (idx !==  1) uSql += ', ';
                uSql += `password = $${idx}`;
                [idx, params] = addSqlParam(password, idx, params);
            }

            uSql += ` WHERE uid = $${idx} RETURNING email, nickname`;
            [idx, params] = addSqlParam(userId, idx, params);

            const user = (await this.pool.query(uSql, params))?.rows[0];

            return { email: user?.email, nickname: user?.nickname };
        }catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

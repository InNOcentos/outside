import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor (@Inject(PG_CONNECTION) private readonly pool: any) { }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password, nickname } = createUserDto;
        let sql = 'INSERT INTO outside.user (email, password, nickname) VALUES ($1, $2, $3) RETURNING email, nickname, uid';
        const user = (await this.pool.query(sql, [email, password, nickname]))?.rows[0];
        return user;
    }

    async getUserByEmail(email: string) {
        let sql = 'SELECT * FROM outside.user ou WHERE email = $1';
        const user = (await this.pool.query(sql, [email]))?.rows[0];
        return user;
    }

    async getUserById(id: string) {
        console.log(id);
        const user = (await this.pool.query('SELECT email, nickname FROM outside.user WHERE uid = $1', [id]))?.rows[0];
        const userTags = (await this.pool.query('SELECT id, name, sortOrder FROM outside.tag WHERE creator = $1', [id]))?.rows;

        return {
            ...user,
            tags: userTags
        };
    }

    async deleteUserById(id: string) {
        return (await this.pool.query('DELETE FROM outside.user WHERE uid = $1 RETURNING uid', [id]))?.rows[0];
    }

    async updateUserById(id: string, newUserData: CreateUserDto): Promise<{ email: string, nickname: string }> {
        if (!Object.keys(newUserData).length) return;
        const { email, nickname, password } = newUserData;
        const getMatches = (await this.pool.query('SELECT uid FROM outside.user WHERE email = $1 OR nickname = $2', [email, nickname]))?.rowCount;
        if (getMatches) {
            throw new HttpException('Пользователь с такими данными уже существует', HttpStatus.CONFLICT);
        }

        let uSql = 'UPDATE outside.user SET ';
        let idx = 1;
        let params: string[] = [];

        if (email) {
            uSql += `email = $${idx}`;
            [idx, params] = addSqlParam(email, idx, params);
        }
        if (nickname) {
            uSql += `nickname = $${idx}`;
            [idx, params] = addSqlParam(email, idx, params);
        }
        if (password) {
            uSql += `password = $${idx}`;
            [idx, params] = addSqlParam(email, idx, params);
        }

        uSql += ` WHERE uid = $${idx}`;

        const user = (await this.pool.query(uSql, params))?.rows[0];

        return { email: user?.email, nickname: user?.nicknam };
    }
}

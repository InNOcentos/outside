import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/constants';

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        connectionString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@db:5432/${process.env.PG_DB}`,
        connectionTimeoutMillis: 56 * 1000,
        idleTimeoutMillis: 56 * 1000,
        max: 26
    })
};

@Module({
    providers:[dbProvider],
    exports: [dbProvider]
})

export class DbModule {}
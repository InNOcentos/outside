import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/constants';

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`,
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
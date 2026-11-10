import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export function databaseConfig(
  entities: MysqlConnectionOptions['entities']
): MysqlConnectionOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
  };
}

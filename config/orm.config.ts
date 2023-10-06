import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { configs } from './configs';

const typeOrmConfig: PostgresConnectionOptions = {
    type: configs.typeOrm.type,
    host: configs.typeOrm.host,
    port: configs.typeOrm.port,
    username: configs.typeOrm.username,
    password: configs.typeOrm.password,
    database: configs.typeOrm.database,
    synchronize: configs.typeOrm.synchronize,
    logging: configs.typeOrm.logging,
    entities: configs.typeOrm.entities
};

export { typeOrmConfig };

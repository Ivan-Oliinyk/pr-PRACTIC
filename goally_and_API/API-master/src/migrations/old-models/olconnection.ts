import * as mongoose from 'mongoose';

const connect = mongoose.createConnection(process.env.MIGRATION_OLD_DB || '');

console.log(process.env.DB_URL);
export { connect };

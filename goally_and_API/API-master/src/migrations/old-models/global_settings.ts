// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const GlobalSettingSchema = new Schema({
  key: { type: String },
  value: { type: String },
});

const OldGlobalSettings = connect.model(
  'GlobalSettings',
  GlobalSettingSchema,
  'global_settings',
);

export { OldGlobalSettings };

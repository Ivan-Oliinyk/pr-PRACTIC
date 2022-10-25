// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';

const Schema = mongoose.Schema;

const DeviceMapSchema = new Schema({
  _id: String,
  device_id: {
    type: String,
    index: true,
    unique: true,
  },
  connected: Boolean,
  fcmToken: String,
  fw_ver: String,
  key: {
    type: String,
    unique: true,
  },
  upgrade: String,
  upgrade_as_json: Boolean,
  url: String,
  when: Date,
  level: Number,
  charging: Number,
  user_id: String,
  battery_opts: String,
  cosu: String,
  model: String,
  past_life: String,
  playservices: Boolean,
  write_settings: Boolean,
  status: String,
  upgrade_fails: Number,
  deactivated: Boolean,
  deactivatedAt: Date,
  playServicesSent: Date,
  gps_tries: Number,
});

const OldDevice = connect.model('DeviceMap', DeviceMapSchema, 'device_map');

export { OldDevice };

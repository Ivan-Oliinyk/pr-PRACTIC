// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const EventsSchema = new Schema(
  {
    _id: String,
    device_id: {
      type: String,
    },
    fw_version: {
      type: String,
    },
    when: {
      type: String,
    },
    level: {
      type: Number,
    },
    charging: {
      type: Number,
    },
    screen: {
      type: String,
    },
    lcd: {
      type: Number,
    },
    topic: {
      type: String,
    },
    datetime: {
      type: Date,
    },
  },
  {
    collection: 'events',
    strict: false,
  },
);

const OldEvents = connect.model('events', EventsSchema);

export { OldEvents };

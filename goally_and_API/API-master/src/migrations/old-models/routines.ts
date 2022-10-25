// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const advschedule = new Schema(
  {
    is_checked: { type: Boolean },
    starttime: { type: String },
    endtime: { type: String },
  },
  { _id: false },
);

const RoutinesSchema = new Schema(
  {
    _id: { type: String },
    title: { type: String },
    schedule: { type: String },
    starttime: { type: String },
    endtime: { type: String },
    hardstop: { type: Number },
    advschedule: { type: [advschedule] },
    userId: { type: String },
    submitted: { type: Date },
    activityCount: { type: Number },
    rank: { type: Number, decimal: true },
    isDeleted: { type: Boolean },
    dtstart: { type: Date, optional: true },
    lastStarted: { type: String, optional: true, defaultValue: null },
    lastShown: { type: String, optional: true, defaultValue: null },
    lastCompleted: { type: String, optional: true, defaultValue: null },
    state: { type: String, defaultValue: '' },
    lastCompletedTimeStamp: {
      type: Number,
      optional: true,
      defaultValue: null,
    },
    lastSkippedTimestamp: { type: Number, optional: true, defaultValue: null },
    lastSkipped: { type: String, optional: true, defaultValue: null },
    color: { type: String, optional: true, defaultValue: '#35A1DB' }, // new field for mobile
    icon: { type: String, optional: true, defaultValue: '' },
    points: { type: Number, optional: true, defaultValue: 100 },
  },
  { strict: false },
);

const OldRoutines = connect.model('routines', RoutinesSchema);

export { OldRoutines };

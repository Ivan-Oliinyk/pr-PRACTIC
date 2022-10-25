// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';

const Schema = mongoose.Schema;

const ActivitiesSchema = new Schema({
  _id: { type: String },
  routineId: {
    type: String,
    index: true,
  },
  title: { type: String },
  schedule: { type: String },
  countdown: { type: Boolean },
  duration: { type: String, optional: true },
  icon: { type: String, optional: true },
  constraint: { type: String, optional: true },
  bonus: { type: Number },
  userId: {
    type: String,
    index: true,
  },
  createdAt: { type: Date },
  rank: { type: Number },
  lastCompleted: { type: String, optional: true, defaultValue: null }, // DEFAUL OLD
  isDeleted: { type: Boolean },
  lastStarted: { type: String, optional: true, defaultValue: null }, // ---
  lastShown: { type: String, optional: true, defaultValue: null }, // ---
  lastSkipped: { type: String, optional: true, defaultValue: null }, // ---
  paused: { type: Boolean, defaultValue: false }, // --
  actualstart: { type: Number, defaultValue: 0 },
  actualend: { type: Number, defaultValue: 0 },
  color: { type: String, optional: true, defaultValue: '#35A1DB' }, // new field for mobile
  minTime: { type: String, optional: true },
  maxTime: { type: String, optional: true },
});

const OldActivities = connect.model('activities', ActivitiesSchema);

export { OldActivities };

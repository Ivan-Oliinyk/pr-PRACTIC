// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const ActivityHistorySchema = new Schema({
  _id: String,
  a_id: String,
  user_id: {
    type: String,
    index: true,
  },
  starttime: Number,
  endtime: Number,
  newpoints: Number,
  skips: Number,
  totalpoints: Number,
  routine_session_id: String,
});

const OldActivityHistory = connect.model(
  'activity_history',
  ActivityHistorySchema,
  'activity_history',
);

export { OldActivityHistory };

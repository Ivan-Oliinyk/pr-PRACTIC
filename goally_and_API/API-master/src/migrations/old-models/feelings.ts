// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const FeelingsSchema = new Schema({
  _id: { type: String },
  routineId: { type: String },
  happiness: { type: String },
  showtime: { type: Number },
  starttime: { type: Number },
  endtime: { type: Number },
  howstarted: { type: String },
  points: { type: Number },
  extra: { type: Number },
  random: { type: Number },
  newpoints: { type: Number },
  totalpoints: { type: Number },
  timestamp: { type: Number },
  session_id: { type: String },
});
const OldFeelings = connect.model('feelings', FeelingsSchema);

export { OldFeelings };

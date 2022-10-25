// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const ActivityHistorySchema = new Schema({
  name: { type: String },
  points: { type: Number },
  icon: {
    type: String,
    optional: true,
    defaultValue: '',
  },
  status: {
    type: Number,
  },
  isEnabled: { type: Boolean, defaultValue: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OldActivityHistory = connect.model(
  'rewardsBank',
  ActivityHistorySchema,
  'rewardsBank',
);
export { OldActivityHistory };

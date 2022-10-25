// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const RewardsSchema = new Schema({
  _id: String,
  name: String,
  points: Number,
  icon: {
    type: String,
    optional: true,
    defaultValue: '',
  },
  userId: {
    type: String,
    index: true,
    ref: 'childs',
  },
  isDeleted: Boolean,
  status: Number,
  timesUsed: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    optional: true,
    defaultValue: '#35A1DB',
  },
  isEnabled: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  rank: {
    type: Number,
    decimal: true,
  },
});

const OldRewards = connect.model('rewards', RewardsSchema);

export { OldRewards };

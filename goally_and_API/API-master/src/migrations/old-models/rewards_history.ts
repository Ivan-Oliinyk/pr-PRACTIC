// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const RewardHistorySchema = new Schema(
  {
    _id: { type: String },
    userId: String,
    pointsBefore: Number,
    pointsSpent: Number,
    rewardId: String,
    desc: String,
    datetime: Date,
  },
  { strict: false },
);

const OldRewardHistory = connect.model(
  'reward_history',
  RewardHistorySchema,
  'reward_history',
);

export { OldRewardHistory };

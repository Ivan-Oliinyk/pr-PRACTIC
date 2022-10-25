// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const BehaviorHistorySchema = new Schema(
  {
    _id: String,
    userId: String,
    pointsBefore: Number,
    pointsChange: Number,
    behaviorId: String,
    desc: String,
    datetime: Date,
  },
  { strict: false },
);

const OldBehaviorHistory = connect.model(
  'behavior_history',
  BehaviorHistorySchema,
  'behavior_history',
);

export { OldBehaviorHistory };

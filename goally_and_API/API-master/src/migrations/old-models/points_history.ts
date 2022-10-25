// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const PointsHistorySchema = new Schema(
  {
    _id: { type: String },
    user_id: {
      type: String,
      index: true,
    },
    points: {
      type: Number,
      index: true,
    },
    previousTotalPoints: { type: Number },
    newTotalPoints: { type: Number },
    bonus: { type: Number },
    random: { type: Number },
    type: { type: String },
    desc: { type: String },
    date: { type: Date },
    r_id: {
      type: String,
    },
  },
  { strict: false },
);

const OldPointsHistory = connect.model(
  'PointsHistory',
  PointsHistorySchema,
  'points_history',
);

export { OldPointsHistory };

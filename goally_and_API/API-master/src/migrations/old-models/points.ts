// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const PointsSchema = new Schema({
  _id: String,
  userId: {
    type: String,
    index: true,
    ref: 'childs',
  },
  points: Number,
});

const oldPoints = connect.model('points', PointsSchema);

export { oldPoints };

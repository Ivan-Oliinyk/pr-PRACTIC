// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const routineHistorySchema = new Schema(
  {
    _id: { type: String },
    r_id: { type: String },
    user_id: {
      type: String,
      index: true,
    },
    state: { type: String },
    show_time: { type: Number },
    start_time: { type: Number },
    end_time: { type: Number },
    start_type: { type: String },
    happiness: { type: String },
    pointsHistoryId: { type: String },
    session_id: { type: String },
    date: { type: Date },
  },
  { strict: false },
);

const OldRoutineHistory = connect.model(
  'routine_history',
  routineHistorySchema,
  'routine_history',
);

export { OldRoutineHistory };

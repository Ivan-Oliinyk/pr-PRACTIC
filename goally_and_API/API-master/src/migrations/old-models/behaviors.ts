// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const BehaviorsSchema = new Schema({
  _id: { type: String },
  name: { type: String },
  points: { type: Number },
  icon: { type: String, optional: true, defaultValue: '' },
  userId: { type: String },
  isEnabled: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  isDeleted: { type: Boolean, defaultValue: false },
  createdAt: {
    type: Date,
    defaultValue: Date.now,
  },
});
const OldBehaviors = connect.model('behaviors', BehaviorsSchema);

export { OldBehaviors };

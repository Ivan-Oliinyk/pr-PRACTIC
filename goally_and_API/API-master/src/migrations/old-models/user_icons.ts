// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const UserIconsSchema = new Schema({
  _id: String,
  name: { type: String },
  icon: { type: String },
  parentId: { type: String },
});

const OldUserIcons = connect.model('userIcons', UserIconsSchema, 'userIcons');
export { OldUserIcons };

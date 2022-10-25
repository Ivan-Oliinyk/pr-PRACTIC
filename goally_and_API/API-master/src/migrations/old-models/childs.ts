// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';

const Schema = mongoose.Schema;

const goally = new Schema(
  {
    points_en: { type: Boolean },
    pause_en: { type: Boolean },
    skip_en: { type: Boolean },
    cancel_en: { type: Boolean },
    applause_en: { type: Boolean },
    happiness_en: { type: Boolean },
    batt_remind_en: { type: Boolean },
    halfway_sound_en: { type: Boolean },
    pause_sound_en: { type: Boolean },
    edit_settings_en: { type: Boolean },
    child_start_en: { type: Boolean },
    volume: { type: Number },
    theme: { type: String },
    redeemOnGoally: { type: Boolean },
    power_save: { type: Number, defaultValue: 0 }, // Todo: Remove Power_save option when all child upgraded to 13.5
    power_save_rtn: { type: Number, defaultValue: 0 },
    power_save_app: { type: Number, defaultValue: 1 },
    neg_points_en: { type: Boolean, defaultValue: true },
  },
  { _id: false },
);

const ChildsSchema = new Schema({
  _id: {
    type: String,
  },
  deviceMapId: {
    type: String,
  },
  goally: {
    type: goally,
  },
  name: {
    type: String,
  },
  parentId: {
    type: String,
  },
});

const OldChild = connect.model('childs', ChildsSchema);

export { OldChild };

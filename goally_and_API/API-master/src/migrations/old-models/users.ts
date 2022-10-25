// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';
const Schema = mongoose.Schema;

const emails = new Schema(
  {
    address: String,
    verified: Boolean,
  },
  { _id: false },
);

const steps = new Schema(
  {
    account: Boolean,
    rewards: Boolean,
    review_morning_routine: Boolean,
    start_morning_routine: Boolean,
    connect_goally: Boolean,
  },
  { _id: false },
);

const profile = new Schema(
  {
    firstTime: Boolean,
    parent_name: String,
    timezone: String,
    points_en: Boolean,
    pause_en: Boolean,
    skip_en: Boolean,
    cancel_en: Boolean,
    applause_en: Boolean,
    happiness_en: Boolean,
    batt_remind_en: Boolean,
    halfway_sound_en: Boolean,
    pause_sound_en: Boolean,
    edit_settings_en: Boolean,
    steps: { type: [steps] },
    steps_intro: Boolean,
    child_name: String,
    phone_number: Boolean,
    child_start_en: Boolean,
    weatherLoc: String,
    country: String,
  },
  { _id: false },
);

const services = new Schema(
  {
    password: {
      bcrypt: String,
    },
  },
  { _id: false },
);

const UsersSchema = new Schema(
  {
    _id: String,
    createdAt: Date,
    isActive: Boolean,
    emails: [emails],
    profile: profile,
    services: services,
  },
  {
    collection: 'users',
    strict: false,
  },
);

const OldUsers = connect.model('Users', UsersSchema);

export { OldUsers };

export interface OldUserType {
  _id: string;
  createdAt: string;
  services: Services;
  emails: Email[];
  profile: Profile;
  isActive: boolean;
  deactivatedAt: string;
}

interface Profile {
  firstTime: boolean;
  parent_name: string;
  timezone: string;
  points_en: boolean;
  pause_en: boolean;
  skip_en: boolean;
  cancel_en: boolean;
  applause_en: boolean;
  happiness_en: boolean;
  batt_remind_en: boolean;
  halfway_sound_en: boolean;
  pause_sound_en: boolean;
  edit_settings_en: boolean;
  parent_app_version: string;
  steps: Steps;
  steps_intro: boolean;
  termsAgreement: boolean;
  child_name: string;
  phone_number: string;
  weatherLoc: string;
  child_start_en: boolean;
  isCameraAllowed: boolean;
  country: string;
  isPremium?: any;
  isProgressAllowed: boolean;
}

interface Steps {
  account: boolean;
  rewards: boolean;
  review_morning_routine: boolean;
  start_morning_routine: boolean;
  connect_goally: boolean;
}

interface Email {
  address: string;
  verified: boolean;
}

interface Services {
  password: Password;
  resume: Resume;
}

interface Resume {
  loginTokens: any[];
}

interface Password {
  bcrypt: string;
}

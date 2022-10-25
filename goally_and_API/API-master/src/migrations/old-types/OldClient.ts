export interface OldClientType {
  _id: string;
  parentId: string;
  name: string;
  deviceMapId: string;
  goally: Goally;
  createdAt: string;
}

interface Goally {
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
  child_start_en: boolean;
  volume: number;
  theme: string;
  neg_points_en: boolean;
  redeemOnGoally: boolean;
}

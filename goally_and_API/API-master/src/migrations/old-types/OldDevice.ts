interface OldDeviceType {
  _id: string;
  device_id: string;
  connected: boolean;
  fcmToken: string;
  fw_ver: string;
  key: string;
  tokenLastUpdated: string;
  upgrade: string;
  upgrade_as_json: boolean;
  url: string;
  when: string;
  level: number;
  deactivated: boolean;
  user_id: string;
  battery_opts: string;
  cosu: string;
  model: string;
  past_life: string;
  playservices: boolean;
  write_settings: boolean;
  status: string;
  upgrade_fails: number;
  charging: number;
  charge3PercentTime?: any;
  chargeDisconnectPercentage: string;
  chargeDisconnectTime: string;
}

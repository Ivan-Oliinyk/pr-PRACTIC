export enum USER_PLANS {
  //stripe plans
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  THERAPY_SUITE = 'therapy_suite',
  PRO_THERAPY_SUITE_DEVICE = 'pro_therapy_suite_device',
  THERAPY_SUITE_DEVICE = 'therapy_suite_device',

  //recurly old plans
  HTS_ONLY_MONTHLY = 'hts_only_monthly',
  HTS_DEVICE_MONTHLY = 'hts_device_monthly',
  HTS_ONLY_PREPAID_36 = 'hts_only_prepaid_36',
  HTS_DEVICE_PREPAID_36 = 'hts_device_prepaid_36',
  HTS_ONLY_PREPAID_12 = 'hts_only_prepaid_12',
  HTS_DEVICE_PREPAID_12 = 'hts_device_prepaid_12',
  HTS_ONLY_PREPAID_24 = 'hts_only_prepaid_24',
  HTS_DEVICE_PREPAID_24 = 'hts_device_prepaid_24',
  SITE_LICENSE = 'site_license',

  //recurly current plans
  LANGUAGE_LIFE_MONTHLY = 'language_life_monthly',
  LANGUAGE_LIFE_ANNUALLY = 'language_life_annually',
  LANGUAGE_ONLY_MONTHLY = 'language_only_monthly',
  LANGUAGE_ONLY_ANNUALLY = 'language_only_annually',
  COACHING_MONTHLY = 'coaching_monthly',
  DEVICE_REPLACEMENT = 'device_replacement',
}

export const config = (): EnvironmentVariables => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DB_URL || 'mongodb://localhost:27017/goally',
  // DATABASE_URL:
  //   'mongodb+srv://goally-newprod:TPRzRISjDs6Pwpqn@cluster1.49k2t.mongodb.net/mygoally',
  KLAYVIO_API_KEY: process.env.KLAYVIO_API_KEY,
  KLAYVIO_API_URL:
    process.env.KLAYVIO_API_URL || 'https://a.klaviyo.com/api/v1/',
  FE_BASE_URL: process.env.FE_BASE_URL || 'localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'local',
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  CLOUD_CONVERT_TOKEN: process.env.CLOUD_CONVERT_TOKEN,
  API_BASE_URL: process.env.API_BASE_URL || 'https://wlapi.goally.co',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
  STRIPE_API_VERSION: '2020-08-27',
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PWD: process.env.SUPER_ADMIN_PWD,
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  REFERSION_PUBLIC_KEY: process.env.REFERSION_PUBLIC_KEY,
  REFERSION_PRIVATE_KEY: process.env.REFERSION_PRIVATE_KEY,
  REFERSION_API_URL: process.env.REFERSION_API_URL,
  RECURLY_PUBLIC_KEY: process.env.RECURLY_PUBLIC_KEY,
  RECURLY_PRIVATE_KEY: process.env.RECURLY_PRIVATE_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUM: process.env.TWILIO_FROM_NUM,
  TINY_URL_API_KEY: process.env.TINY_URL_API_KEY,
  SHIPPO_PRIVATE_KEY: process.env.SHIPPO_PRIVATE_KEY,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
  AUTH0_WP_CLIENT_ID: process.env.AUTH0_WP_CLIENT_ID,
  AUTH0_WP_CLIENT_SECRET: process.env.AUTH0_WP_CLIENT_SECRET,
  AUTH0_CTA_CLIENT_ID: process.env.AUTH0_CTA_CLIENT_ID,
  AUTH0_CTA_CLIENT_SECRET: process.env.AUTH0_CTA_CLIENT_SECRET,
});

export interface EnvironmentVariables {
  PORT: number;
  DATABASE_URL: string;
  KLAYVIO_API_KEY: string;
  KLAYVIO_API_URL: string;
  FE_BASE_URL: string;
  NODE_ENV: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  CLOUD_CONVERT_TOKEN: string;
  API_BASE_URL: string;
  AWS_BUCKET: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  STRIPE_API_VERSION: '2020-08-27';
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PWD: string;
  FCM_SERVER_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  REFERSION_PUBLIC_KEY: string;
  REFERSION_PRIVATE_KEY: string;
  REFERSION_API_URL: string;
  RECURLY_PUBLIC_KEY: string;
  RECURLY_PRIVATE_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUM: string;
  TINY_URL_API_KEY: string;
  SHIPPO_PRIVATE_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  SENTRY_DSN: string;
  AUTH0_BASE_URL: string;
  AUTH0_WP_CLIENT_ID: string;
  AUTH0_WP_CLIENT_SECRET: string;
  AUTH0_CTA_CLIENT_ID: string;
  AUTH0_CTA_CLIENT_SECRET: string;
}

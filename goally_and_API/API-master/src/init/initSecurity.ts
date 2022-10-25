import { INestApplication } from '@nestjs/common';
import * as morgan from 'morgan';

export function setupSecurity(app: INestApplication) {
  console.log(process.env.NODE_ENV);
  app.enableCors({
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });
  app.use(morgan('tiny'));
  // app.use(helmet());
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 1000, // limit each IP to 1000 requests per windowMs
  //   }),
  // );
}

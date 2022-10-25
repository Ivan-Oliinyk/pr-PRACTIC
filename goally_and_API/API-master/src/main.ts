import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as xmlparser from 'express-xml-bodyparser';
import { AppModule } from './app.module';
import { config } from './config';
import {
  setupGlobalFilter,
  setupGlobalPipes,
  setupHotReload,
  setupImagesAndTags,
  setupLogger,
  setupSecurity,
  setupSocketAdapter,
  setupSuperAdmin,
} from './init';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: setupLogger(),
  });
  app.setGlobalPrefix('/v1/api');
  setupSecurity(app);
  setupGlobalFilter(app);
  setupGlobalPipes(app);
  console.log('setup base structure');
  await setupImagesAndTags(app);
  await setupSuperAdmin(app);
  console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀');
  console.log(`Server started on port ${config().PORT}`);
  console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀');
  setupSocketAdapter(app);
  app.use(xmlparser());
  await app.listen(config().PORT);
  setupHotReload(app);
}

bootstrap().catch(console.log);

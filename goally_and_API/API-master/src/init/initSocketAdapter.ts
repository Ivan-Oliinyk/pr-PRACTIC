import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevicesService } from 'src/entities/devices/devices.service';
import { SessionsService } from 'src/entities/sessions/sessions.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisIoAdapter } from 'src/socket/adapter/socket-redis.adapter';
import { InitWebSocketPushes } from 'src/socket/services/initial-request.service';

export function setupSocketAdapter(app: INestApplication) {
  const config = app.get(ConfigService);
  const sessionService = app.get(SessionsService);
  const deviceService = app.get(DevicesService);
  const redisService = app.get(RedisService);
  const initWSpushes = app.get(InitWebSocketPushes);

  app.useWebSocketAdapter(
    new RedisIoAdapter(
      app,
      config,
      sessionService,
      deviceService,
      redisService,
      initWSpushes,
    ),
  );
}

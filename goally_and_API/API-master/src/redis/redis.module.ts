import { forwardRef, Module } from '@nestjs/common';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { RedisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Module({
  imports: [forwardRef(() => DevicesModule)],
  providers: [RedisProvider, RedisService],
  exports: [RedisProvider, RedisService],
})
export class RedisModule {}

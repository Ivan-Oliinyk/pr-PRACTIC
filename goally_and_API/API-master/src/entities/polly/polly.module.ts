import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollyController } from './polly.controller';
import { PollyService } from './polly.service';

@Module({
  imports: [ConfigModule],
  controllers: [PollyController],
  providers: [PollyService],
  exports: [PollyService],
})
export class PollyModule {}

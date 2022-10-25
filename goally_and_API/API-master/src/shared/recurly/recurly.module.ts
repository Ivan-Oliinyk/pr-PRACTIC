import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecurlyController } from './recurly.controller';
import { RecurlyService } from './recurly.service';

@Module({
  imports: [ConfigModule],
  providers: [RecurlyService],
  controllers: [RecurlyController],
  exports: [RecurlyService],
})
export class RecurlyModule {}

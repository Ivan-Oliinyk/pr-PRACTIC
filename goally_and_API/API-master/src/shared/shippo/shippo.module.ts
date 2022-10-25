import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShippoController } from './shippo.controller';
import { ShippoService } from './shippo.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ShippoService],
  controllers: [ShippoController],
  exports: [ShippoService],
})
export class ShippoModule {}

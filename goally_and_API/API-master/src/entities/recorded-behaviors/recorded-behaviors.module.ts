import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BehaviorModule } from '../behavior/behavior.module';
import { ClientsModule } from '../clients/clients.module';
import { DevicesModule } from '../devices/devices.module';
import { RecordedBehaviorsController } from './recorded-behaviors.controller';
import { RecordedBehaviorsService } from './recorded-behaviors.service';
import {
  RecordedBehavior,
  RecordedBehaviorSchema,
} from './schema/recorded-behavior.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecordedBehavior.name, schema: RecordedBehaviorSchema },
    ]),
    ClientsModule,
    BehaviorModule,
    forwardRef(() => DevicesModule),
  ],
  providers: [RecordedBehaviorsService],
  controllers: [RecordedBehaviorsController],
  exports: [RecordedBehaviorsService],
})
export class RecordedBehaviorsModule {}

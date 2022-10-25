import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { BehaviorTrainingsController } from './behavior-trainings.controller';
import { BehaviorTrainingsService } from './behavior-trainings.service';
import {
  BehaviorTraining,
  BehaviorTrainingSchema,
} from './schema/behavior-training.schema';
import { TrainingSegmentsModule } from './training-segments/training-segments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BehaviorTraining.name, schema: BehaviorTrainingSchema },
    ]),
    forwardRef(() => ClientsModule),
    forwardRef(() => DevicesModule),
    TrainingSegmentsModule,
    UsersModule,
  ],
  controllers: [BehaviorTrainingsController],
  providers: [BehaviorTrainingsService],
  exports: [BehaviorTrainingsService],
})
export class BehaviorTrainingsModule {}

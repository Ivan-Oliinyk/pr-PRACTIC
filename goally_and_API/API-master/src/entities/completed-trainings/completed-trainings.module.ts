import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BehaviorTrainingsModule } from '../behavior-trainings/behavior-trainings.module';
import { ClientsModule } from '../clients/clients.module';
import { CompletedTrainingsController } from './completed-trainings.controller';
import { CompletedTrainingsService } from './completed-trainings.service';
import {
  CompletedTraining,
  CompletedTrainingSchema,
} from './schema/completed-training.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedTraining.name, schema: CompletedTrainingSchema },
    ]),
    forwardRef(() => ClientsModule),
    BehaviorTrainingsModule,
  ],
  controllers: [CompletedTrainingsController],
  providers: [CompletedTrainingsService],
  exports: [CompletedTrainingsService],
})
export class CompletedTrainingsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from '../activities/activities.module';
import { ClientsModule } from '../clients/clients.module';
import { RoutinesModule } from '../routines/routines.module';
import { PlayedRoutineService } from './played-routine.service';
import {
  PlayedRoutine,
  PlayedRoutineSchema,
} from './schema/played-routine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayedRoutine.name, schema: PlayedRoutineSchema },
    ]),
    forwardRef(() => RoutinesModule),
    ActivitiesModule,
    forwardRef(() => ClientsModule),
  ],
  providers: [PlayedRoutineService],
  exports: [PlayedRoutineService],
})
export class PlayedRoutineModule {}

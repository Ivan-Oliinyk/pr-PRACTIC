import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from 'src/entities/activities/activities.module';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { SharedModule } from 'src/shared/shared.module';
import { PlayedRoutineModule } from '../played-routine/played-routine.module';
import { QuizletModule } from '../quizlet/quizlet.module';
import { UsersModule } from '../users/users.module';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { Routine, RoutineSchema } from './schema/routine.schema';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Routine.name,
        useFactory: (emitter: GoallyEventEmitter): typeof RoutineSchema => {
          RoutineSchema.post('findOneAndUpdate', function(doc) {
            console.log('routine Updated');
          });

          RoutineSchema.post<Routine>('save', function(doc) {
            console.log('routine saved');
          });

          RoutineSchema.post<Routine>(
            'remove',
            { document: true, query: false },
            function(doc) {
              console.log('routine remove');
            },
          );

          return RoutineSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
    forwardRef(() => DevicesModule),
    forwardRef(() => PlayedRoutineModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => QuizletModule),
    ActivitiesModule,
    forwardRef(() => SharedModule),
  ],
  providers: [RoutinesService],
  controllers: [RoutinesController],
  exports: [RoutinesService],
})
export class RoutinesModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsModule } from '../clients/clients.module';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { QuizletController } from './quizlet.controller';
import { QuizletService } from './quizlet.service';
import { Quizlet, QuizletSchema } from './schema/quizlet.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Quizlet.name,
        useFactory: (emitter: GoallyEventEmitter): typeof QuizletSchema => {
          QuizletSchema.post('findOneAndUpdate', function(doc) {
            console.log('Quizlet Updated');
          });

          QuizletSchema.post<Quizlet>('save', function(doc) {
            console.log('Quizlet saved');
          });

          QuizletSchema.post<Quizlet>(
            'remove',
            { document: true, query: false },
            function(doc) {
              console.log('Quizlet remove');
            },
          );

          return QuizletSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
    forwardRef(() => ClientsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => DevicesModule),
  ],
  controllers: [QuizletController],
  providers: [QuizletService],
  exports: [QuizletService],
})
export class QuizletModule {}

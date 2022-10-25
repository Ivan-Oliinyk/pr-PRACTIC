import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsModule } from '../clients/clients.module';
import { QuizletModule } from '../quizlet/quizlet.module';
import { CompletedQuizletController } from './completed-quizlet.controller';
import { CompletedQuizletService } from './completed-quizlet.service';
import {
  CompletedQuizlet,
  CompletedQuizletSchema,
} from './schema/completed-quizlet.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CompletedQuizlet.name,
        useFactory: (
          emitter: GoallyEventEmitter,
        ): typeof CompletedQuizletSchema => {
          CompletedQuizletSchema.post('findOneAndUpdate', function(doc) {
            console.log('CompletedQuizlet Updated');
          });

          CompletedQuizletSchema.post<CompletedQuizlet>('save', function(doc) {
            console.log('CompletedQuizlet saved');
          });

          CompletedQuizletSchema.post<CompletedQuizlet>(
            'remove',
            { document: true, query: false },
            function(doc) {
              console.log('CompletedQuizlet remove');
            },
          );

          return CompletedQuizletSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
    forwardRef(() => ClientsModule),
    QuizletModule,
  ],
  controllers: [CompletedQuizletController],
  providers: [CompletedQuizletService],
  exports: [CompletedQuizletService],
})
export class CompletedQuizletModule {}

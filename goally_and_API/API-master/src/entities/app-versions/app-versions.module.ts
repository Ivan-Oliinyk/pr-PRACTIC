import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AppVersionsController } from './app-versions.controller';
import { AppVersionsService } from './app-versions.service';
import { AppVersion, AppVersionSchema } from './schema/app-version.shema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: AppVersion.name,
        useFactory: (emitter: GoallyEventEmitter): typeof AppVersionSchema => {
          AppVersionSchema.post('findOneAndUpdate', function(doc) {
            console.log('AppVersion Updated');
          });

          AppVersionSchema.post<AppVersion>('save', function(doc) {
            console.log('AppVersion saved');
          });

          AppVersionSchema.post<AppVersion>(
            'remove',
            { document: true, query: false },
            function(doc) {
              console.log('AppVersion remove');
            },
          );

          return AppVersionSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
  ],

  controllers: [AppVersionsController],
  providers: [AppVersionsService],
  exports: [AppVersionsService],
})
export class AppVersionsModule {}

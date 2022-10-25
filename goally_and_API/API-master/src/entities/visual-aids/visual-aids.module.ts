import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AacWordsModule } from '../aac/aac-words/aac-words.module';
import { VisualAid, VisualAidsSchema } from './schema/visual-aids.schema';
import { VisualAidsController } from './visual-aids.controller';
import { VisualAidsService } from './visual-aids.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisualAid.name, schema: VisualAidsSchema },
    ]),
    ConfigModule,
    AacWordsModule,
  ],
  controllers: [VisualAidsController],
  providers: [VisualAidsService],
  exports: [VisualAidsService],
})
export class VisualAidsModule {}

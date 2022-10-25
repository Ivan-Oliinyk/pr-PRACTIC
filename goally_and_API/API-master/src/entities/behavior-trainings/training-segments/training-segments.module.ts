import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrainingSegment,
  TrainingSegmentSchema,
} from './schema/training-segment.schema';
import { TrainingSegmentsController } from './training-segments.controller';
import { TrainingSegmentsService } from './training-segments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrainingSegment.name, schema: TrainingSegmentSchema },
    ]),
  ],

  providers: [TrainingSegmentsService],
  controllers: [TrainingSegmentsController],
  exports: [TrainingSegmentsService],
})
export class TrainingSegmentsModule {}

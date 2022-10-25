import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { AacWordsModule } from '../aac-words/aac-words.module';
import { AacPlayedController } from './aac-played.controller';
import { AacPlayedService } from './aac-played.service';
import {
  AacPlayedWord,
  AacPlayedWordSchema,
} from './schema/aac-played-word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AacPlayedWord.name, schema: AacPlayedWordSchema },
    ]),
    AacWordsModule,
    forwardRef(() => ClientsModule),
  ],
  providers: [AacPlayedService],
  controllers: [AacPlayedController],
  exports: [AacPlayedService],
})
export class AacPlayedModule {}

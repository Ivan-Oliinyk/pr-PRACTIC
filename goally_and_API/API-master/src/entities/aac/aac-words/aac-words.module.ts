import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { PollyModule } from 'src/entities/polly/polly.module';
import { AacFoldersModule } from '../aac-folders/aac-folders.module';
import { AacWordsController } from './aac-words.controller';
import { AacWordsService } from './aac-words.service';
import { AacWord, AacWordSchema } from './schema/aac-word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AacWord.name, schema: AacWordSchema }]),
    ConfigModule,
    forwardRef(() => ClientsModule),
    PollyModule,
    AacFoldersModule,
  ],
  controllers: [AacWordsController],
  providers: [AacWordsService],
  exports: [AacWordsService],
})
export class AacWordsModule {}

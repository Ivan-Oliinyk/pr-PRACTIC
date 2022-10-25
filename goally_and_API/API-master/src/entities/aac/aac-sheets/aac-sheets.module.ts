import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollyModule } from 'src/entities/polly/polly.module';
import { AacFoldersModule } from '../aac-folders/aac-folders.module';
import { AacWordsModule } from '../aac-words/aac-words.module';
import { AacSheetsService } from './aac-sheets.service';

@Module({
  imports: [ConfigModule, AacWordsModule, AacFoldersModule, PollyModule],
  providers: [AacSheetsService],
  exports: [AacSheetsService],
})
export class AacSheetsModule {}

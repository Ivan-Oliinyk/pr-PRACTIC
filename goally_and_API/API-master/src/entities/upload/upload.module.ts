import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [SharedModule, ConfigModule],
  controllers: [UploadController],
})
export class UploadModule {}

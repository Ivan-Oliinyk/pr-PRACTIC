import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { LabWordsController } from './lab-words.controller';
import { LabWordsService } from './lab-words.service';
import { LabWord, LabWordSchema } from './schema/lab-word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LabWord.name, schema: LabWordSchema }]),
    forwardRef(() => ClientsModule),
    ConfigModule,
  ],
  controllers: [LabWordsController],
  providers: [LabWordsService],
  exports: [LabWordsService],
})
export class LabWordsModule {}

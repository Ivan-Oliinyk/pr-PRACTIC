import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { AacWord, AacWordSchema } from '../aac-words/schema/aac-word.schema';
import { AacFoldersController } from './aac-folders.controller';
import { AacFoldersService } from './aac-folders.service';
import { AacFolder, AacFolderSchema } from './schema/aac-folder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AacWord.name, schema: AacWordSchema }]),
    MongooseModule.forFeature([
      { name: AacFolder.name, schema: AacFolderSchema },
    ]),
    ConfigModule,
    forwardRef(() => ClientsModule),
  ],
  providers: [AacFoldersService],
  controllers: [AacFoldersController],
  exports: [AacFoldersService],
})
export class AacFoldersModule {}

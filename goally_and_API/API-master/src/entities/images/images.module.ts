import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Images, ImagesSchema } from './schema/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Images.name, schema: ImagesSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}

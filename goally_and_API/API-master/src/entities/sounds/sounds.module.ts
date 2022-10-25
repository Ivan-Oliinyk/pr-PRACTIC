import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { Sound, SoundSchema } from './schema/sound.schema';
import { SoundsController } from './sounds.controller';
import { SoundsService } from './sounds.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sound.name, schema: SoundSchema }]),
    forwardRef(() => ClientsModule),
  ],
  controllers: [SoundsController],
  providers: [SoundsService],
  exports: [SoundsService],
})
export class SoundsModule {}

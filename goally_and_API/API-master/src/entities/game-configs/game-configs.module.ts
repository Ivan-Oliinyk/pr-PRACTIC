import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { GameConfigsController } from './game-configs.controller';
import { GameConfigsService } from './game-configs.service';
import { GameConfig, GameConfigSchema } from './schema/game-configs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameConfig.name, schema: GameConfigSchema },
    ]),
    forwardRef(() => ClientsModule),
  ],
  controllers: [GameConfigsController],
  providers: [GameConfigsService],
  exports: [GameConfigsService],
})
export class GameConfigsModule {}

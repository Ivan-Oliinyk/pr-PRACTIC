import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { PuzzlesController } from './puzzles.controller';
import { PuzzlesService } from './puzzles.service';
import { Puzzles, PuzzlesSchema } from './schema/puzzles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Puzzles.name, schema: PuzzlesSchema }]),
    ConfigModule,
    forwardRef(() => ClientsModule),
  ],
  controllers: [PuzzlesController],
  providers: [PuzzlesService],
  exports: [PuzzlesService],
})
export class PuzzlesModule {}

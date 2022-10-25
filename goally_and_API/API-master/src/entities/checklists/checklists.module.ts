import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { ClientsModule } from '../clients/clients.module';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { Checklist, ChecklistSchema } from './schema/checklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checklist.name, schema: ChecklistSchema },
    ]),
    forwardRef(() => ClientsModule),
    forwardRef(() => SharedModule),
  ],
  providers: [ChecklistsService],
  controllers: [ChecklistsController],
  exports: [ChecklistsService],
})
export class ChecklistsModule {}

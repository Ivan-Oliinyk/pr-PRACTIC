import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ClientsModule } from '../clients/clients.module';
import { CompletedChecklistsController } from './completed-checklists.controller';
import { CompletedChecklistsService } from './completed-checklists.service';
import {
  CompletedChecklist,
  CompletedChecklistSchema,
} from './schema/completed-checklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedChecklist.name, schema: CompletedChecklistSchema },
    ]),
    ChecklistsModule,
    forwardRef(() => ClientsModule),
  ],
  controllers: [CompletedChecklistsController],
  providers: [CompletedChecklistsService],
  exports: [CompletedChecklistsService],
})
export class CompletedChecklistsModule {}

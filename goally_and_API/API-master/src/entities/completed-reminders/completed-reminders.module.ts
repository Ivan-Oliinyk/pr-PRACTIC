import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { RemindersModule } from '../reminders/reminders.module';
import { CompletedRemindersController } from './completed-reminders.controller';
import { CompletedRemindersService } from './completed-reminders.service';
import {
  CompletedReminder,
  CompletedReminderSchema,
} from './schema/completed-reminder.schema';

@Module({
  imports: [
    forwardRef(() => ClientsModule),
    RemindersModule,
    MongooseModule.forFeature([
      { name: CompletedReminder.name, schema: CompletedReminderSchema },
    ]),
  ],
  providers: [CompletedRemindersService],
  controllers: [CompletedRemindersController],
  exports: [CompletedRemindersService],
})
export class CompletedRemindersModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { UsersModule } from '../users/users.module';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { Reminder, ReminderSchema } from './schema/reminder.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
    ]),
    forwardRef(() => ClientsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [RemindersService],
  controllers: [RemindersController],
  exports: [RemindersService],
})
export class RemindersModule {}

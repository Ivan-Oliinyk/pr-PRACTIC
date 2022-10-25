import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { CreateChildReminderDto } from './dto/CreateChildReminder.dto';
import { CreateReminderDto } from './dto/CreateReminder.dto';
import { ReorderReminder } from './dto/ReorderReminder';
import { UpdateReminderDto } from './dto/UpdateReminder.dto';
import { RemindersService } from './reminders.service';

@Controller('reminders')
@UseGuards(AuthGuard)
export class RemindersController {
  constructor(private rs: RemindersService) {}

  @Get('/notification-sounds')
  getNotificationSounds(@UserFromReq() user: User) {
    const sounds = this.rs.getNotificationSounds();
    return sounds;
  }

  @Post('/library')
  async create(@Body() body: CreateReminderDto, @UserFromReq() user: User) {
    const reminder = await this.rs.create(body, user);
    return reminder;
  }
  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  async createChild(
    @Body() rewardData: CreateChildReminderDto,
    @UserFromReq() user: User,
  ) {
    const reward = await this.rs.createForChild(rewardData, user);
    return reward;
  }
  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderReminder) {
    return this.rs.reorderChildLibrary(data);
  }

  @Get('/library')
  async getUserLibrary(@UserFromReq() user: User) {
    const reminders = await this.rs.getUserReminders(user);
    return reminders;
  }

  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async geChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    console.log(clientId);
    const reminders = await this.rs.getUserRemindersForChild(
      clientId as Types.ObjectId,
    );
    return reminders;
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseObjectIdPipe) reminderId,
    @UserFromReq() user: User,
  ) {
    const reminder = await this.rs.getById(reminderId as Types.ObjectId);
    return reminder;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseObjectIdPipe) reminderId,
    @Body() body: UpdateReminderDto,
    @UserFromReq() user: User,
  ) {
    const reminder = await this.rs.update(
      reminderId as Types.ObjectId,
      body,
      user,
    );
    return reminder;
  }

  @Delete('/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) reminderId,
    @UserFromReq() user: User,
  ) {
    const reminder = await this.rs.delete(reminderId as Types.ObjectId, user);
    return reminder;
  }
}

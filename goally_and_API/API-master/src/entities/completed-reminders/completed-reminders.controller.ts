import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import {
  ParseIntPipe,
  ParseObjectIdPipe,
} from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CompletedRemindersService } from './completed-reminders.service';

@UseGuards(AuthGuard)
@Controller('completed-reminders')
export class CompletedRemindersController {
  constructor(private crs: CompletedRemindersService) {}

  @Delete('/:id')
  async removeChildRedeemRewards(
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    const reward = await this.crs.deleteById(id as Types.ObjectId, user);
    return reward;
  }

  @Get('child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getChildCompletedReminderss(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const reward = await this.crs.getChildCompletedReminders(
      clientId as Types.ObjectId,
      user,
      daysBefore,
    );
    return reward;
  }

  @Get('child-library/')
  async getAllCompletedReminders(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const behaviors = await this.crs.getAllCompletedReminders(user, daysBefore);
    return behaviors;
  }
}

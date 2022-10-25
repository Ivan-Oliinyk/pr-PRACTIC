import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CompletedSleepModeService } from './completed-sleep-mode.service';

@Controller('completed-sleep-mode')
@UseGuards(AuthGuard)
export class CompletedSleepModeController {
  constructor(private csms: CompletedSleepModeService) {}

  @Get('')
  async getFinishedLibrary(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const sleepModes = await this.csms.getFinishedLibrary(user, daysBefore);
    return sleepModes;
  }

  @Get('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getFinishedChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const sleepModes = await this.csms.getFinishedSleepModeByChildId(
      clientId as Types.ObjectId,
      daysBefore,
    );
    return sleepModes;
  }

  @Delete('/:completedSleepModeId')
  @UseGuards(UserAccessToTheClient)
  async deleteFinishedSleepMode(
    @UserFromReq() user: User,
    @Param('completedSleepModeId', ParseObjectIdPipe) completedSleepModeId,
  ) {
    const sleepMode = await this.csms.deleteById(
      completedSleepModeId as Types.ObjectId,
    );
    return sleepMode;
  }
}

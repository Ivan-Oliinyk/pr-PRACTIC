import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { SleepModeDto } from './dto/sleep-mode.dto';
import { SleepModeService } from './sleep-mode.service';
@Controller('sleep-mode')
@UseGuards(AuthGuard)
export class SleepModeController {
  constructor(private sm: SleepModeService) {}

  @Get('/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  getClientSleepMode(@Param('clientId', ParseObjectIdPipe) clientId) {
    return this.sm.getClientSleepMode(clientId);
  }

  @Put('update/:id')
  @UseGuards(UserAccessToTheClient)
  update(
    @Body() body: SleepModeDto,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.sm.update(body, id, user);
  }

  @Post('/client')
  @UseGuards(UserAccessToTheClient)
  async createClientSleepMode(
    @Body() sleepModeData: SleepModeDto,
    @UserFromReq() user: User,
  ) {
    const sleepMode = await this.sm.createClientSleepMode(sleepModeData, user);
    return sleepMode;
  }

  @Get('/aids')
  async getSleepAids(@UserFromReq() user: User) {
    const result = await this.sm.getSleepAids(user);
    return result;
  }
}

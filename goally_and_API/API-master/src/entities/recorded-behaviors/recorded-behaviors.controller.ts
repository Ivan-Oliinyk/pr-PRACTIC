import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CreateRecordedBehavior } from './dto/CreateRecordedBehavior.dto';
import { RecordBehavior } from './dto/RecordBehaviorDto';
import { RecordedBehaviorsService } from './recorded-behaviors.service';

@Controller('recorded-behaviors')
@UseGuards(AuthGuard)
export class RecordedBehaviorsController {
  constructor(private brs: RecordedBehaviorsService) {}

  @Post('')
  async create(
    @Body() behaviorData: CreateRecordedBehavior,
    @UserFromReq() user: User,
  ) {
    const behavior = await this.brs.create(behaviorData, user);
    return behavior;
  }
  @Post('/record')
  @UseGuards(UserAccessToTheClient)
  async record(
    @Body() behaviorData: RecordBehavior,
    @UserFromReq() user: User,
  ) {
    const behavior = await this.brs.record(behaviorData, user);
    return behavior;
  }

  @Delete('/:id')
  async delete(
    @UserFromReq() user: User,
    @Param('id', ParseObjectIdPipe) behaviorId,
  ) {
    const balance = await this.brs.deleteById(
      behaviorId as Types.ObjectId,
      user,
    );
    return balance;
  }

  @Get('child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getRecordedLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const behaviors = await this.brs.getChildRecordedBehavior(
      clientId as Types.ObjectId,
      user,
      daysBefore,
    );
    return behaviors;
  }

  @Get('child-library/')
  async getAllRecordedBehaviors(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const behaviors = await this.brs.getAllRecordedBehaviors(
      user,
      daysBefore,
    );
    return behaviors;
  }
}

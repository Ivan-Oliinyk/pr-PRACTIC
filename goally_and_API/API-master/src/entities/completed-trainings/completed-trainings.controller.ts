import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CompletedTrainingsService } from './completed-trainings.service';

@UseGuards(AuthGuard)
@Controller('completed-trainings')
export class CompletedTrainingsController {
  constructor(private cts: CompletedTrainingsService) {}

  @Get('/all')
  @UseGuards(UserAccessToTheClient)
  async getAllCompletedTrainings(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
    @Query('type', new DefaultValuePipe('')) type: string,
  ) {
    const trainings = await this.cts.getAllCompletedTrainings(
      user,
      daysBefore,
      type,
    );
    return trainings;
  }

  @Get('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getChildCompletedTrainings(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
    @Query('type', new DefaultValuePipe('')) type: string,
  ) {
    const trainings = await this.cts.getChildCompletedTrainings(
      clientId,
      user,
      daysBefore,
      type,
    );
    return trainings;
  }
}

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
import { CompletedChecklistsService } from './completed-checklists.service';

@Controller('completed-checklists')
@UseGuards(AuthGuard)
export class CompletedChecklistsController {
  constructor(private ccs: CompletedChecklistsService) {}

  @Get('')
  async getFinishedLibrary(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const checklists = await this.ccs.getFinishedLibrary(user, daysBefore);
    return checklists;
  }

  @Get('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getFinishedChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const checklists = await this.ccs.getFinishedChecklistByChildId(
      clientId as Types.ObjectId,
      daysBefore,
    );
    return checklists;
  }

  @Delete('/:completedChecklistId')
  @UseGuards(UserAccessToTheClient)
  async deleteFinishedChecklist(
    @UserFromReq() user: User,
    @Param('completedChecklistId', ParseObjectIdPipe) completedChecklistId,
  ) {
    const checklists = await this.ccs.deleteById(
      completedChecklistId as Types.ObjectId,
    );
    return checklists;
  }
}

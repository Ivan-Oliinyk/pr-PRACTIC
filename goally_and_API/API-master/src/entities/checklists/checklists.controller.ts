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
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { EmailPdfDto } from '../routines/dto/EmailPdf.dto';
import { User } from '../users/schema';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistDto } from './dto/CreateChecklist.dto';
import { CreateChildChecklistDto } from './dto/CreateChildChecklist.dto';
import { ReorderChecklistDto } from './dto/ReorderChecklist.dto';
import { UpdateChecklistDto } from './dto/UpdateChecklist.dto';

@Controller('checklists')
@UseGuards(AuthGuard)
export class ChecklistsController {
  constructor(private checklistService: ChecklistsService) {}

  @Post('/library')
  async create(@Body() body: CreateChecklistDto, @UserFromReq() user: User) {
    const checklist = await this.checklistService.create(body, user);
    return checklist;
  }
  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  async createChildChecklist(
    @Body() body: CreateChildChecklistDto,
    @UserFromReq() user: User,
  ) {
    const checklist = await this.checklistService.createChildChecklist(
      body,
      user,
    );
    return checklist;
  }

  @Get('/library')
  async getUserLibrary(@UserFromReq() user: User) {
    const checklists = await this.checklistService.getUserChecklists(user);
    return checklists;
  }
  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderChecklistDto) {
    return this.checklistService.reorderChildLibrary(data);
  }
  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async geChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    const checklists = await this.checklistService.getUserChecklistsForChild(
      clientId as Types.ObjectId,
    );
    return checklists;
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseObjectIdPipe) checklistId,
    @UserFromReq() user: User,
  ) {
    const routine = await this.checklistService.getById(
      checklistId as Types.ObjectId,
      user,
    );
    return routine;
  }
  @Put('/:id')
  async update(
    @Param('id', ParseObjectIdPipe) checklistId,
    @Body() body: UpdateChecklistDto,
    @UserFromReq() user: User,
  ) {
    const checklist = await this.checklistService.update(
      checklistId as Types.ObjectId,
      body,
      user,
    );
    return checklist;
  }
  @Delete('/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) checklistId,
    @UserFromReq() user: User,
  ) {
    const checklist = await this.checklistService.delete(
      checklistId as Types.ObjectId,
      user,
    );
    return checklist;
  }

  @Post('/email-pdf')
  async emailPdf(@Body() body: EmailPdfDto) {
    const response = await this.checklistService.emailPdf(body.email, body.id);
    return response;
  }

  @Delete('/:checklistId/activity/:activityId')
  async deleteChecklistActivity(
    @Param('checklistId', ParseObjectIdPipe) checklistId,
    @Param('activityId', ParseObjectIdPipe) activityId,
    @UserFromReq() user: User,
  ) {
    const checklist = await this.checklistService.deleteChecklistActivity(
      checklistId as Types.ObjectId,
      activityId as Types.ObjectId,
      user,
    );
    return checklist;
  }
}

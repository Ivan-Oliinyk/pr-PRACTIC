import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { SaveCompletedRoutine } from '../played-routine/dto/SaveCompletedRoutine.dto';
import { PlayedRoutineService } from '../played-routine/played-routine.service';
import {
  CreateChildRoutineDto,
  CreateRoutineDto,
  ReorderRoutineDto,
  UpdateRoutineDto,
} from './dto';
import { EmailPdfDto } from './dto/EmailPdf.dto';
import { GetActiveRoutineDto } from './dto/GetActiveRoutines.dto';
import { UpdateRoutineOrdersDto } from './dto/UpdateRoutineOrder.dto';
import { RoutinesService } from './routines.service';
@Controller('routines')
@UseGuards(AuthGuard)
export class RoutinesController {
  constructor(
    private routineService: RoutinesService,
    @Inject(forwardRef(() => PlayedRoutineService))
    private playedRoutineService: PlayedRoutineService,
  ) {}

  @Post('/library')
  async create(@Body() body: CreateRoutineDto, @UserFromReq() user: User) {
    const routine = await this.routineService.create(body, user);
    return routine;
  }

  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  async createChildRoutine(
    @Body() body: CreateChildRoutineDto,
    @UserFromReq() user: User,
  ) {
    const routine = await this.routineService.createChildRoutine(body, user);
    return routine;
  }
  @Get('/prompts-options')
  async getTipOptions(@UserFromReq() user: User) {
    const options = this.playedRoutineService.getPromptsOptions();
    return options;
  }
  @Get('/library')
  async getUserLibrary(@UserFromReq() user: User) {
    const routines = await this.routineService.getUserRoutines(user);
    return routines;
  }
  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderRoutineDto) {
    return this.routineService.reorderChildLibrary(data);
  }
  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async geChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    console.log(clientId);
    const routines = await this.routineService.getUserRoutinesForChild(
      clientId as Types.ObjectId,
    );
    return routines;
  }

  @Get('/finished/')
  async getFinishedLibrary(
    @UserFromReq() user: User,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const routines = await this.playedRoutineService.getFinishedLibrary(
      user,
      daysBefore,
    );
    return routines;
  }
  @Get('/finished/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getFinishedChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('daysBefore', new DefaultValuePipe(1), ParseIntPipe)
    daysBefore: number,
  ) {
    const routines = await this.playedRoutineService.getFinishedRoutineByChildId(
      clientId as Types.ObjectId,
      daysBefore,
    );
    return routines;
  }
  @Put('/finished/:routineId')
  @UseGuards(UserAccessToTheClient)
  async saveFinishedChildLibrary(
    @UserFromReq() user: User,
    @Body() routineData: SaveCompletedRoutine,
    @Param('routineId', ParseObjectIdPipe) routineId,
  ) {
    const routines = await this.playedRoutineService.savePlayed(
      routineId as Types.ObjectId,
      routineData,
      user,
    );
    return routines;
  }

  @Delete('/finished/:routineId')
  @UseGuards(UserAccessToTheClient)
  async deleteFinishedRoutineFromHistory(
    @UserFromReq() user: User,
    @Param('routineId', ParseObjectIdPipe) routineId,
  ) {
    const routines = await this.playedRoutineService.deleteById(
      routineId as Types.ObjectId,
    );
    return routines;
  }

  @Post('/active-global')
  async getActiveGlobalRoutines(@Body() body: GetActiveRoutineDto) {
    const routines = await this.routineService.getTemplateFolderActiveRoutines(
      body,
    );
    return routines;
  }

  @Get('/notification-sounds')
  getNotificationSounds(@UserFromReq() user: User) {
    const sounds = this.routineService.getNotificationSounds();
    return sounds;
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseObjectIdPipe) routineId,
    @UserFromReq() user: User,
  ) {
    const routine = await this.routineService.getByIdWithCreatedBy(
      routineId as Types.ObjectId,
      user,
      true,
    );
    return routine;
  }
  @Put('/app-reorder/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  async updateOrderings(
    @Body() body: UpdateRoutineOrdersDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const routines = await this.routineService.updateOrderings(
      clientId,
      body,
      user,
    );
    return routines;
  }
  @Put('/app-reorder/lib')
  async updateLibOrderings(
    @Body() body: UpdateRoutineOrdersDto,
    @UserFromReq() user: User,
  ) {
    const routines = await this.routineService.updateOrderings(
      null,
      body,
      user,
    );
    return routines;
  }
  @Put('/:id')
  async update(
    @Param('id', ParseObjectIdPipe) routineId,
    @Body() body: UpdateRoutineDto,
    @UserFromReq() user: User,
  ) {
    const routine = await this.routineService.update(
      routineId as Types.ObjectId,
      body,
      user,
    );
    return routine;
  }
  @Delete('/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) routineId,
    @UserFromReq() user: User,
  ) {
    const routine = await this.routineService.delete(
      routineId as Types.ObjectId,
      user,
    );
    return routine;
  }
  @Post('/email-pdf')
  async emailPdf(@Body() body: EmailPdfDto) {
    const response = await this.routineService.emailPdf(body.email, body.id);
    return response;
  }
}

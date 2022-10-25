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
import {
  CreateChildQuizletDto,
  CreateQuizlet,
  ReorderQuizlet,
  UpdateQuizlet,
} from './dto';
import { UpdateQuizletOrdersDto } from './dto/UpdateQuizletOrder.dto';
import { QuizletService } from './quizlet.service';
@Controller('quizlet')
@UseGuards(AuthGuard)
export class QuizletController {
  constructor(private qs: QuizletService) {}
  @Post('/library')
  async create(@Body() quizletData: CreateQuizlet, @UserFromReq() user: User) {
    const quizlet = await this.qs.create(quizletData, user);
    return quizlet;
  }
  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  async createChild(
    @Body() quizletData: CreateChildQuizletDto,
    @UserFromReq() user: User,
  ) {
    const quizlet = await this.qs.createForChild(quizletData, user);
    return quizlet;
  }
  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderQuizlet) {
    return this.qs.reorderChildLibrary(data);
  }

  @Get('/library')
  async getUserLibrary(@UserFromReq() user: User) {
    const quizlets = await this.qs.getUserQuizletLibrary(user);
    return quizlets;
  }
  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getClientLibrary(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const quizlets = await this.qs.getUserQuizletForChild(
      clientId as Types.ObjectId,
      user,
    );
    return quizlets;
  }

  @Delete('/:id')
  async deleteById(
    @Param('id', ParseObjectIdPipe) quizletId,
    @UserFromReq() user: User,
  ) {
    const quizlet = await this.qs.delete(quizletId as Types.ObjectId, user);
    return quizlet;
  }

  @Get('/:id')
  async getOne(
    @Param('id', ParseObjectIdPipe) quizletId,
    @UserFromReq() user: User,
  ) {
    const quizlet = await this.qs.getByIdWithCreatedBy(
      quizletId as Types.ObjectId,
      user,
    );
    return quizlet;
  }

  @Put('/app-reorder/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  async updateOrderings(
    @Body() body: UpdateQuizletOrdersDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const quizlets = await this.qs.updateOrderings(clientId, body, user);
    return quizlets;
  }

  @Put('/app-reorder/lib')
  async updateLibOrderings(
    @Body() body: UpdateQuizletOrdersDto,
    @UserFromReq() user: User,
  ) {
    const quizlets = await this.qs.updateOrderings(null, body, user);
    return quizlets;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseObjectIdPipe) quizletId,
    @Body() quizletData: UpdateQuizlet,
    @UserFromReq() user: User,
  ) {
    const quizlet = await this.qs.update(
      quizletId as Types.ObjectId,
      quizletData,
      user,
    );
    return quizlet;
  }
}

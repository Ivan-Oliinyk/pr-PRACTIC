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
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { BehaviorTrainingsService } from './behavior-trainings.service';
import { CreateBehaviorTraining } from './dto/CreateBehaviorTraining';
import { CreateBehaviorTrainingChild } from './dto/CreateBehaviorTrainingChild';
import { ReorderBehaviorTraining } from './dto/RecorderBehaviorTraining';
import { UpdateBehaviorTrainingOrdersDto } from './dto/UpdateBehaviorTrainingOrder.dto';

@Controller('behavior-trainings')
@UseGuards(AuthGuard)
export class BehaviorTrainingsController {
  constructor(private bts: BehaviorTrainingsService) {}

  @Post('/library')
  create(@Body() body: CreateBehaviorTraining, @UserFromReq() user: User) {
    return this.bts.create(body, user);
  }

  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  createForChild(
    @Body() body: CreateBehaviorTrainingChild,
    @UserFromReq() user: User,
  ) {
    console.log(body);

    return this.bts.createForChild(body, user);
  }

  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderBehaviorTraining) {
    return this.bts.reorderChildLibrary(data);
  }

  @Get('/library')
  getUserLibrary(@UserFromReq() user: User) {
    return this.bts.getUserBehaviorTrainings(user);
  }

  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.bts.getChildLibrary(clientId, user);
  }

  @Get('/:id')
  getById(@Param('id', ParseObjectIdPipe) id) {
    return this.bts.findById(id);
  }

  @Put('/app-reorder/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  async updateOrderings(
    @Body() body: UpdateBehaviorTrainingOrdersDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const behaviorTrainings = await this.bts.updateOrderings(
      clientId,
      body,
      user,
    );
    return behaviorTrainings;
  }
  @Put('/app-reorder/lib')
  async updateLibOrderings(
    @Body() body: UpdateBehaviorTrainingOrdersDto,
    @UserFromReq() user: User,
  ) {
    const behaviorTrainings = await this.bts.updateOrderings(null, body, user);
    return behaviorTrainings;
  }

  @Put('/:id')
  update(
    @Body() body: CreateBehaviorTraining,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.bts.update(body, id, user);
  }

  @Delete('/:id')
  delete(@Param('id', ParseObjectIdPipe) id, @UserFromReq() user: User) {
    return this.bts.deleteById(id, user);
  }
}

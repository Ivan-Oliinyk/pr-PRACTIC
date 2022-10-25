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
import { BehaviorService } from './behavior.service';
import {
  CreateBehavior,
  CreateBehaviorChild,
  ReorderBehavior,
  UpdateBehavior,
} from './dto';
import { UpdateBehaviorOrdersDto } from './dto/UpdateBehaviorOrder.dto';
@Controller('behavior')
@UseGuards(AuthGuard)
export class BehaviorController {
  constructor(private bs: BehaviorService) {}

  @Post('/library')
  create(@Body() body: CreateBehavior, @UserFromReq() user: User) {
    return this.bs.create(body, user);
  }
  @Post('/child-library')
  @UseGuards(UserAccessToTheClient)
  createForChild(@Body() body: CreateBehaviorChild, @UserFromReq() user: User) {
    console.log(body);

    return this.bs.createForChild(body, user);
  }

  @Post('/child-library/reorder')
  async reorderChildLibrary(@Body() data: ReorderBehavior) {
    return this.bs.reorderChildLibrary(data);
  }

  @Get('/library')
  getUserLibrary(@UserFromReq() user: User) {
    return this.bs.getUserBehaviors(user);
  }

  @Get('/child-library/:clientId')
  @UseGuards(UserAccessToTheClient)
  getChildLibrary(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.bs.getChildLibrary(clientId, user);
  }

  @Get('/:id')
  getById(@Param('id', ParseObjectIdPipe) id) {
    return this.bs.findById(id);
  }

  @Put('/app-reorder/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  async updateOrderings(
    @Body() body: UpdateBehaviorOrdersDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const behaviors = await this.bs.updateOrderings(clientId, body, user);
    return behaviors;
  }

  @Put('/app-reorder/lib')
  async updateLibOrderings(
    @Body() body: UpdateBehaviorOrdersDto,
    @UserFromReq() user: User,
  ) {
    const behaviors = await this.bs.updateOrderings(null, body, user);
    return behaviors;
  }

  @Put('/:id')
  update(
    @Body() body: UpdateBehavior,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.bs.update(body, id, user);
  }

  @Delete('/:id')
  delete(@Param('id', ParseObjectIdPipe) id, @UserFromReq() user: User) {
    return this.bs.deleteById(id, user);
  }
}

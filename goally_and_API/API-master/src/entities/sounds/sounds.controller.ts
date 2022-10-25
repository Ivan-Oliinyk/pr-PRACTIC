import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/users/schema';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { CreateSoundDto } from './dto/CreateSound';
import { SoundsService } from './sounds.service';

@Controller('sounds')
@UseGuards(AuthGuard)
export class SoundsController {
  constructor(private ss: SoundsService) {}

  @Get('/client/:clientId')
  @UseGuards(UserAccessToTheClient)
  getClientSound(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
  ) {
    return this.ss.getClientSound(clientId, user);
  }

  @Get('/voices')
  voices(@UserFromReq() user: User) {
    return this.ss.voices(user);
  }

  @Put('update/:id')
  @UseGuards(UserAccessToTheClient)
  update(
    @Body() body: CreateSoundDto,
    @Param('id', ParseObjectIdPipe) id,
    @UserFromReq() user: User,
  ) {
    return this.ss.update(body, id, user);
  }
}

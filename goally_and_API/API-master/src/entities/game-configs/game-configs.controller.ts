import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { UpdateGameConfigDto } from './dto/UpdateGameConfig.dto';
import { UpdateMagicPlayMinsDto } from './dto/UpdateMagicPlayMins.dto';
import { GameConfigsService } from './game-configs.service';

@Controller('game-configs')
@UseGuards(AuthGuard)
export class GameConfigsController {
  constructor(private gc: GameConfigsService) {}

  @Get('get/:clientId')
  @UseGuards(UserAccessToTheClient)
  async get(@Param('clientId', ParseObjectIdPipe) clientId) {
    const game = await this.gc.getClientGameConfig(clientId);
    return game;
  }

  @Put('update/:id')
  @UseGuards(UserAccessToTheClient)
  async update(
    @Body() body: UpdateGameConfigDto,
    @Param('id', ParseObjectIdPipe) id,
  ) {
    const updatedGameConfig = await this.gc.update(body, id);
    return updatedGameConfig;
  }

  @Put('update-magic-play-mins/:id')
  @UseGuards(UserAccessToTheClient)
  async updateMagicPlayMins(
    @Body() body: UpdateMagicPlayMinsDto,
    @Param('id', ParseObjectIdPipe) id,
  ) {
    const updatedGameConfig = await this.gc.updateMagicPlayMins(body, id);
    return updatedGameConfig;
  }
}

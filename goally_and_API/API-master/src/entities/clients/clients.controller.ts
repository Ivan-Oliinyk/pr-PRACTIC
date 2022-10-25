import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAccessToTheClient } from 'src/shared/guards/user-access-client.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { AvailabilityDto } from './dto/AvailabilityDto';
import { CreateOnboardingClientsDto } from './dto/CreateClientsDto';
import { EntityNameDto } from './dto/EntityNameDto';
import { UpdateCtaOrderingDto } from './dto/UpdateCtaOrderingDto';

@UseGuards(AuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private clientService: ClientsService,
    private usersService: UsersService,
  ) {}

  @Post()
  async createClient(
    @UserFromReq() user: User,
    @Body() clientData: CreateClientDto,
  ) {
    const client = await this.clientService.create(clientData, user);
    console.log(client);
    return client;
  }
  @Post('/multiple')
  async createClients(
    @UserFromReq() user: User,
    @Body() clientsData: CreateOnboardingClientsDto,
  ) {
    console.log('here');
    const clients = await this.clientService.createMultiple(clientsData, user);
    console.log(clients);
    return clients;
  }

  @Put('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async updateClient(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
    @Body() clientData: UpdateClientDto,
  ) {
    const client = await this.clientService.update(
      clientId,
      clientData,
      user._id,
    );
    return client;
  }

  @Put('/add-device/:clientId')
  @UseGuards(UserAccessToTheClient)
  async addClientDevice(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
    @Body() clientData: UpdateClientDto,
  ) {
    const client = await this.clientService.addDevice(
      clientId,
      clientData,
      user,
    );
    return client;
  }

  @Get('/:clientId/users-with-access')
  @UseGuards(UserAccessToTheClient)
  async getUserWithAccess(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
  ) {
    const users = await this.clientService.getUserWithAccess(clientId);

    return users;
  }
  @Delete('/:clientId/users-with-access/:userId')
  @UseGuards(UserAccessToTheClient)
  async removeAccessToTheChild(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('userId') userToRevokeId,

    @UserFromReq()
    user: User,
  ) {
    const response = await this.clientService.removeUserWithAccess(
      clientId,
      userToRevokeId,
      user,
    );
    return response;
  }

  @Get('/:clientId/pending-invites')
  @UseGuards(UserAccessToTheClient)
  async getPendingInvites(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
  ) {
    const users = await this.clientService.getPendingInvites(clientId);

    return users;
  }

  @Get('/:clientId/billing-info')
  @UseGuards(UserAccessToTheClient)
  async getClientBillingInfo(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
  ) {
    const users = await this.clientService.getClientBillingInfo(clientId);

    return users;
  }
  @Delete('/:clientId/pending-invites/:inviteId')
  @UseGuards(UserAccessToTheClient)
  async removePendingInvite(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('inviteId', ParseObjectIdPipe) inviteId,
    @UserFromReq()
    user: User,
  ) {
    const response = await this.clientService.revokeInviteByID(
      clientId,
      inviteId,
      user,
    );

    return response;
  }

  @Get('/onboarding-tiles')
  async getOnBoardTiles(
    @UserFromReq() user: User,
    @Query('clientId', new DefaultValuePipe('')) clientId,
  ) {
    const tiles = await this.clientService.getOnBoardTiles(user, clientId);
    return tiles;
  }

  @Get('/:clientId/devices')
  @UseGuards(UserAccessToTheClient)
  async getDevices(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const clients = await this.clientService.getAllDevicesByClientId(clientId);
    return clients;
  }

  @Get('/work-goals')
  async getWorkGoals() {
    return this.clientService.getWorkGoals();
  }

  @Get('/diagnosis')
  async getDiagnosis() {
    return this.clientService.getDiagnosis();
  }

  @Get('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async getClient(@Param('clientId', ParseObjectIdPipe) clientId) {
    const client = await this.clientService.findByIdFull(clientId);
    return client;
  }

  @Delete('/:clientId')
  @UseGuards(UserAccessToTheClient)
  async deleteSiteClient(
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq() user: User,
  ) {
    const clients = await this.clientService.deleteSiteClient(user, clientId);
    return clients;
  }

  @Post('/availability')
  @UseGuards(UserAccessToTheClient)
  async checkAvailability(@Body() body: AvailabilityDto) {
    const clientAvailability = await this.clientService.checkAvailability(
      body.clientId,
      body.schedule,
    );
    return clientAvailability;
  }

  @Post('/:clientId/routines-checklists-reminders')
  @UseGuards(UserAccessToTheClient)
  async getRoutineChecklistsAndReminders(
    @Body() body: EntityNameDto,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @UserFromReq()
    user: User,
  ) {
    const response = await this.clientService.getRoutineChecklistsAndReminders(
      body,
      clientId,
    );
    return response;
  }

  @Put('/:clientId/update-cta-ordering')
  @UseGuards(UserAccessToTheClient)
  async updateCtaOrdering(
    @UserFromReq()
    user: User,
    @Body() body: UpdateCtaOrderingDto,
  ) {
    try {
      await this.clientService.updateCtaOrderings(body, user);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { CreateInvitationCtaDto } from './dto/CreateInvitationCtaDto';
import { CreateInvitationDto } from './dto/CreateInvitationDto';
import { UpdateInvitationDto } from './dto/UpdateInvitationDto';
import { InvitationService } from './invitation.service';
@Controller('invitation')
export class InvitationController {
  constructor(private invitationService: InvitationService) {}

  @UseGuards(AuthGuard)
  @Post('/cta')
  async createInvitationFromCta(
    @Body() body: CreateInvitationCtaDto,
    @UserFromReq() user: User,
  ) {
    const invitations = await this.invitationService.createInvitationFromCta(
      body,
      user,
    );
    return invitations;
  }

  @UseGuards(AuthGuard)
  @Post()
  async createInvitations(
    @Body() body: CreateInvitationDto,
    @UserFromReq() user: User,
  ) {
    const invitations = await this.invitationService.createInvitations(
      body,
      user,
    );
    return invitations;
  }

  @UseGuards(AuthGuard)
  @Post('/resend/:id')
  async resendInvite(@Param('id', ParseObjectIdPipe) id) {
    const invitation = await this.invitationService.resendInvite(
      id as Types.ObjectId,
    );
    return invitation;
  }

  @UseGuards(AuthGuard)
  @Put('/update/:id')
  async update(
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateInvitationDto,
  ) {
    const invitation = await this.invitationService.update(id, body);
    return invitation;
  }

  @Get('')
  async getInviteByCode(@Query('code', new DefaultValuePipe('')) code: string) {
    const invitation = await this.invitationService.getInviteByCode(code);
    return invitation;
  }

  @Get('/:id')
  async getInviteById(@Param('id', ParseObjectIdPipe) id) {
    const invitation = await this.invitationService.getInvite(
      id as Types.ObjectId,
    );
    return invitation;
  }
}

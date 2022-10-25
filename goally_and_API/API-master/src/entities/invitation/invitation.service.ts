import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { find, uniq } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { MessangerService } from 'src/shared/messanger/messanger.service';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schema/client.schema';
import { User } from '../users/schema';
import { CreateInvitationCtaDto } from './dto/CreateInvitationCtaDto';
import { CreateInvitationDto } from './dto/CreateInvitationDto';
import { UpdateInvitationDto } from './dto/UpdateInvitationDto';
import { Invitation } from './schema/invitation.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const unwind = require('lodash-unwind')();

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name) private InvitationModel: Model<Invitation>,
    private us: UsersService,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    private ms: MailerService,
    private smsService: MessangerService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async createInvitation(
    invitation: {
      type: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      email?: string;
    },
    assignedClient: string,
    invitedBy: Types.ObjectId,
  ) {
    console.log(invitation, assignedClient);
    const TypedClientId = new Types.ObjectId(assignedClient);

    if (invitation.phoneNumber || invitation.email) {
      const existingInvitation = await this.InvitationModel.remove({
        assignedClient: TypedClientId,
        email: invitation.email,
        phoneNumber: invitation.phoneNumber,
      });
    }
    const newInvitation = new this.InvitationModel({
      ...invitation,
      assignedClient: TypedClientId,
      invitedBy,
    });
    const savedInvite = await newInvitation.save();
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.INVITES,
      user: savedInvite.invitedBy,
      client: TypedClientId,
      meta: { email: invitation.email },
    });
    return savedInvite;
  }

  async createInvitations(inviteData: CreateInvitationDto, user: User) {
    const unwindDataByClients = unwind(inviteData, 'assignedClients');
    const unwindDataByEmail = unwind(unwindDataByClients, 'invitations');
    const invitedBy = user._id;
    const emails = inviteData.invitations.map(invitation =>
      invitation.email.toLowerCase(),
    );
    if (emails.length != uniq(emails).length)
      throw new BadRequestException(`You should provide unique email address.`);
    const usersWhichAlreadyRegistered = await this.us.isUserExist(emails);

    const userAlreadyConnectedToTheClient = usersWhichAlreadyRegistered
      .map(e => {
        const client = (e.clients as Client[]).find(e =>
          inviteData.assignedClients.includes(e._id.toString()),
        );
        return {
          email: e.email,
          client,
        };
      })
      .filter(e => e.client);

    if (userAlreadyConnectedToTheClient.length) {
      throw new BadRequestException(
        userAlreadyConnectedToTheClient
          .map(e => {
            return `user with email ${e.email} already connected to the client ${e.client.firstName} ${e.client.lastName}`;
          })
          .join(','),
      );
    }
    console.log(unwindDataByEmail);
    const createdInvitation: Invitation[] = await Promise.all(
      unwindDataByEmail.map(data =>
        this.createInvitation(
          data.invitations,
          data.assignedClients,
          invitedBy,
        ),
      ),
    );

    const sentEmail = await Promise.all(
      createdInvitation.map(data =>
        this.ms.sendInvitationEmail(
          { name: 'Client', email: data.email },
          data._id,
          Boolean(
            find(
              usersWhichAlreadyRegistered,
              user => user.email === data.email,
            ),
          ),
        ),
      ),
    );

    return createdInvitation;
  }

  async update(id: Types.ObjectId, data: UpdateInvitationDto) {
    const invitation = await this.InvitationModel.findById(id);
    if (!invitation) throw new NotFoundException('Invitation not found');

    const updatedInvitation = await this.InvitationModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    );
    return updatedInvitation;
  }

  async getInvite(id: Types.ObjectId) {
    try {
      const invite = await this.InvitationModel.findById(id).lean();
      if (!invite) throw new NotFoundException('Invite not found');

      let customerExist: User;
      if (invite.email) customerExist = await this.us.findByEmail(invite.email);
      else if (invite.phoneNumber)
        customerExist = await this.us.findByPhoneNumber(invite.phoneNumber);
      const invitedBy = await this.us.findById(invite.invitedBy);
      return {
        ...invite,
        customerExist: Boolean(customerExist),
        invitedByName: `${invitedBy.firstName} ${invitedBy.lastName}`,
      };
    } catch (e) {
      throw new NotFoundException(`Invite not found ${e}`);
    }
  }
  async getInviteInfoForSignUp(id) {
    const invite = await this.InvitationModel.findById(id);
    if (!invite) throw new NotFoundException('Invite not found');
    return [invite.assignedClient];
  }
  remove(id: Types.ObjectId) {
    return this.InvitationModel.findByIdAndRemove(id);
  }

  async resendInvite(id: Types.ObjectId) {
    const invite = await this.InvitationModel.findById(id);
    if (!invite) throw new NotFoundException('Invite not found');
    if (!invite.phoneNumber)
      throw new NotFoundException('Phone number not found to resend invite');

    const user = await this.us.isEmailOrPhoneNumberExists(
      '',
      invite.phoneNumber,
    );
    const sentSms = await this.sendInvitationSms(invite, user.isExists);
    return invite;
  }

  async getInviteByClientId(clientId: Types.ObjectId) {
    return this.InvitationModel.find({
      assignedClient: clientId,
    });
  }

  async createInvitationFromCta(
    inviteData: CreateInvitationCtaDto,
    user: User,
  ) {
    const invitedBy = user._id;
    const assignedClient = await this.cs.findById(inviteData.assignedClient);
    if (!assignedClient)
      throw new NotFoundException(
        `Client ${inviteData.assignedClient} not found`,
      );

    let existingUser: User;
    if (inviteData.phoneNumber) {
      existingUser = await this.us.isUserExistByPhoneNumber(
        inviteData.phoneNumber,
      );

      if (existingUser) {
        const client = (existingUser.clients as Client[]).find(
          e => inviteData.assignedClient == e._id.toString(),
        );

        if (client)
          throw new BadRequestException(
            `user with phone number ${existingUser.phoneNumber} already connected to the client ${client.firstName} ${client.lastName}`,
          );
      }
    }

    const createdInvitation: Invitation = await this.createInvitation(
      {
        firstName: inviteData.firstName,
        lastName: inviteData.lastName,
        type: inviteData.type,
        phoneNumber: inviteData.phoneNumber,
      },
      (inviteData.assignedClient as unknown) as string,
      invitedBy,
    );

    if (createdInvitation.phoneNumber) {
      await this.sendInvitationSms(
        createdInvitation,
        Boolean(existingUser?.phoneNumber === createdInvitation.phoneNumber),
      );
    }
    return createdInvitation;
  }

  async sendInvitationSms(invitation: Invitation, isExistingCustomer: boolean) {
    const client = await this.cs.findById(invitation.assignedClient);
    const user = await this.us.findById(invitation.invitedBy);
    const msg = `${user.firstName} ${user.lastName} is inviting you to manage ${client.firstName} ${client.lastName}’s Goally. Download the app here - https://linktr.ee/getgoally\nYour login code: ${invitation.code}\nIf you already have the app, go to user profiles and click the plus button.`;
    return this.smsService.sendSms(msg, invitation.phoneNumber);
  }

  async getInviteByCode(code: string) {
    try {
      const invite = await this.InvitationModel.findOne({
        code: code.toUpperCase(),
      }).lean();
      if (!invite) throw new NotFoundException('Invite not found');

      let customerExist: User;
      if (invite.email) customerExist = await this.us.findByEmail(invite.email);
      if (invite.phoneNumber)
        customerExist = await this.us.findByPhoneNumber(invite.phoneNumber);
      const invitedBy = await this.us.findById(invite.invitedBy);
      return {
        ...invite,
        customerExist: Boolean(customerExist),
        invitedByName: `${invitedBy.firstName} ${invitedBy.lastName}`,
      };
    } catch (e) {
      throw new NotFoundException(`Invite not found ${e}`);
    }
  }

  async deleteInviatationsAfter30Days() {
    console.log('deleteInviatationsAfter30Days');
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return this.InvitationModel.deleteMany({
      createdAt: { $lt: date },
    });
  }
}

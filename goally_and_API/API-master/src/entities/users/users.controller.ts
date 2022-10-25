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
import { config } from 'src/config';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import {
  CreateOrgDto,
  CreatePaymentDetails,
  UpdateOrgDto,
  UpdateUserDto,
} from './dto/';
import { AddRemoveEmailDto } from './dto/AddRemoveEmailDto';
import { UpdateFcmTokenDto } from './dto/UpdateFcmTokenDto';
import { UpdatePayPalDto } from './dto/UpdatePayPalDto';
import { User } from './schema';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@UserFromReq() user: User) {
    return this.userService.findByIdFull(user._id);
  }

  @UseGuards(AuthGuard)
  @Put('/me')
  putMe(@UserFromReq() user: User, @Body() data: UpdateUserDto) {
    return this.userService.updateMe(user._id, data);
  }

  @UseGuards(AuthGuard)
  @Post('/org')
  createOrg(@Body() org: CreateOrgDto, @UserFromReq() owner: User) {
    const createdOrg = this.userService.createOrganization(org, owner);
    return createdOrg;
  }
  @UseGuards(AuthGuard)
  @Put('/org/:orgId')
  updateOrg(
    @Param('orgId', ParseObjectIdPipe) orgId,
    @Body() org: UpdateOrgDto,
    @UserFromReq() user: User,
  ) {
    const updatedOrg = this.userService.updateOrg(
      orgId as Types.ObjectId,
      org,
      user,
    );
    return updatedOrg;
  }
  @UseGuards(AuthGuard)
  @Post('/org/join/:orgCode')
  joinToOrg(@Param('orgCode') orgCode: string, @UserFromReq() user: User) {
    const createdOrg = this.userService.joinToOrgByCode(orgCode, user);
    return createdOrg;
  }

  @UseGuards(AuthGuard)
  @Get('/org/:id')
  async getOrgById(@Param('orgId', ParseObjectIdPipe) orgId) {
    const org = await this.userService.findOrgById(orgId as Types.ObjectId);
    return org;
  }

  @UseGuards(AuthGuard)
  @Get('/reset-stripe')
  //TODO: add admin auth
  resetStripe(@UserFromReq() user: User, @Body() data: CreatePaymentDetails) {
    if (config().NODE_ENV != 'PRODUCTION')
      return this.userService.UserModel.updateMany(
        {},
        {
          plan: USER_PLANS.FREE,
          stripeCustomerId: null,
          last4: '',
          paymentMethod: '',
          subscription: null,
        },
      );
  }

  @UseGuards(AuthGuard)
  @Get('/email-to-lower')
  //TODO: add admin auth
  async updateUsersEmailToLowerCase(
    @UserFromReq() user: User,
    @Body() data: CreatePaymentDetails,
  ) {
    if (config().NODE_ENV != 'PRODUCTION') {
      const users = await this.userService.UserModel.find({});
      users.map(e => {
        e.email = e.email.toLowerCase();
        return e.save();
      });
    }
  }

  @Put('/update-fcm-token')
  @UseGuards(AuthGuard)
  async updateFcmToken(
    @UserFromReq() user: User,
    @Body() fcmTokenDto: UpdateFcmTokenDto,
  ) {
    return this.userService.updateFcmToken(user._id, fcmTokenDto);
  }

  @Get('/exists/')
  isEmailExists(
    @Query('email', new DefaultValuePipe('')) email: string,
    @Query('phoneNumber', new DefaultValuePipe('')) phoneNumber: string,
  ) {
    return this.userService.validateEmailAndPhoneNumber(email, phoneNumber);
  }

  @Put('/update-pay-pal-id')
  @UseGuards(AuthGuard)
  async updatePayPalId(
    @UserFromReq() user: User,
    @Body() payPalDto: UpdatePayPalDto,
  ) {
    return this.userService.updatePayPalId(user._id, payPalDto);
  }

  @UseGuards(AuthGuard)
  @Put('/completed-tile/:tileId')
  addCompletedTile(
    @UserFromReq() user: User,
    @Param('tileId', ParseObjectIdPipe) tileId,
  ) {
    return this.userService.addCompletedTile(tileId, user);
  }

  @UseGuards(AuthGuard)
  @Get('/clients')
  getUserClients(@UserFromReq() user: User) {
    return this.userService.getUserClients(user._id);
  }

  @Post('/abandoned-email')
  async addRemoveFromList(@Body() body: AddRemoveEmailDto) {
    const userFromDb = await this.userService.addRemoveFromList(body);
    return userFromDb;
  }
}

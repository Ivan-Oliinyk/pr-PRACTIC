import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { uniqBy } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { InvoiceCollection, TransactionError } from 'recurly';
import { lastValueFrom } from 'rxjs';
import { EnvironmentVariables } from 'src/config';
import { MissingSubscriptionDto } from 'src/entities/admin/dto/MissingSubscriptionDto';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
import { BehaviorService } from 'src/entities/behavior/behavior.service';
import { ClientsService } from 'src/entities/clients/clients.service';
import { InvitationService } from 'src/entities/invitation/invitation.service';
import { QuizletService } from 'src/entities/quizlet/quizlet.service';
import { ReferralsService } from 'src/entities/referrals/referrals.service';
import { RewardsService } from 'src/entities/rewards/rewards.service';
import { RoutinesService } from 'src/entities/routines/routines.service';
import { SessionsService } from 'src/entities/sessions/sessions.service';
import { SubscriptionService } from 'src/entities/subscription/subscription.service';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { APPS } from 'src/shared/const/applications';
import { AUTH0, LAST_LOGIN_MEDIUMS, OTP_TYPE } from 'src/shared/const/autho';
import { PAYMENT_MEDIUMS } from 'src/shared/const/payment-mediums';
import { RECURLY_ITEMS } from 'src/shared/const/recurly-items';
import { RECURLY, RECURLY_PLANS } from 'src/shared/const/recurly-plans';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { isDuplicateMongoError } from 'src/shared/helper';
import { DateTimeHelper } from 'src/shared/helper/DateTimeHelper';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { NewCheckoutDto } from 'src/shared/recurly/dto/NewCheckoutDto';
import { RecurlyService } from 'src/shared/recurly/recurly.service';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPwdDto, LoginDto, RegistrationDto, ResetPwdDto } from './dto';
import { GetAccessTokenDto } from './dto/GetAccessTokenDto';
import { SendOtpDto } from './dto/SendOtpDto';
import { ForgotPwdRequest } from './forgot-pwd.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ForgotPwdRequest.name)
    private ForgotPwdRequests: Model<ForgotPwdRequest>,
    private userService: UsersService,
    private sessionsService: SessionsService,
    private mailService: MailerService,
    private invitationService: InvitationService,
    private rs: RoutinesService,
    private rewardService: RewardsService,
    private behaviorService: BehaviorService,
    private quizletService: QuizletService,
    private subscriptionService: SubscriptionService,
    private recurly: RecurlyService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private referralService: ReferralsService,
    private clientService: ClientsService,
    private http: HttpService,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  async login(loginData: LoginDto) {
    //passwordless authentication
    if (loginData.accessToken) {
      if (!(await this.isValidAccessToken(loginData.accessToken))) {
        throw new BadRequestException('Invalid Access Token');
      }
    }

    let user: User;
    if (loginData.email) {
      user = await this.userService.findByEmail(loginData.email);
    } else if (loginData.phoneNumber) {
      user = await this.userService.findByPhoneNumber(loginData.phoneNumber);
    } else {
      throw new BadRequestException('Email or Phone Number must be provided.');
    }
    if (!user) throw new BadRequestException('User not found');
    else user.lastLoginMedium = LAST_LOGIN_MEDIUMS.PASSWORDLESS;

    //password authentication
    if (!loginData.accessToken) {
      const isPasswordMatch = await user.comparePasswords(loginData.password);
      if (!isPasswordMatch)
        throw new BadRequestException('Incorrect password or email');

      user.lastLoginMedium = LAST_LOGIN_MEDIUMS.PASSWORD;
    }

    return await this.commonLogin(user, loginData.invitationId);
  }
  async isValidAccessToken(accessToken: string) {
    try {
      const res$ = this.http.get(AUTH0.USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const auth0ResponseValue = await lastValueFrom(res$);
      if (auth0ResponseValue.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('AccessToken is invalid', error);
      return false;
    }
  }
  async commonLogin(user: User, invitationId: Types.ObjectId = null) {
    const { token } = await this.sessionsService.create(user._id);
    await this.userService.update(user._id, {
      lastLoginMedium: user.lastLoginMedium,
    });

    // INVITE FLOW HANDLE
    let updatedUser;
    if (invitationId) {
      updatedUser = await this.invitationFlow(user, invitationId);
    } else {
      updatedUser = user;
    }

    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.SESSION,
      user: updatedUser._id,
      client: null,
      meta: null,
    });
    return { ...updatedUser.toObject(), token };
  }
  async invitationFlow(user: User, invitationId: Types.ObjectId) {
    const clientsToAssign: { clients: Types.ObjectId[] } = { clients: [] };
    clientsToAssign.clients = await this.invitationService.getInviteInfoForSignUp(
      invitationId,
    );
    user.clients = uniqBy(
      (user.clients as Types.ObjectId[]).concat(clientsToAssign.clients),
      id => id.valueOf(),
    );
    //if user after invitation skip payment details
    user.plan = USER_PLANS.FREE;
    await user.save();
    await this.invitationService.remove(invitationId);
    //if user is site license then add this to same device
    if (user.isSiteLicense) {
      const clientId = clientsToAssign.clients[0];
      await this.clientService.addExistingSiteLicenseDevice(clientId, user);
    }
    return user;
  }

  async logout(token: string, user: User) {
    const tokenFromDb = this.sessionsService.delete(token);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.SESSION,
      user: user._id,
      client: null,
      meta: null,
    });
    return tokenFromDb;
  }

  async signUp(user: RegistrationDto) {
    try {
      const dataToAssign = { clients: [], plan: user.plan };
      if (user.invitationId) {
        dataToAssign.clients = await this.invitationService.getInviteInfoForSignUp(
          user.invitationId,
        );
        //if user after invitation skip payment details
        dataToAssign.plan = USER_PLANS.FREE;
      }
      if (user.isSiteLicense) dataToAssign.plan = USER_PLANS.SITE_LICENSE;

      const userFromDb = await this.userService.create({
        ...user,
        ...dataToAssign,
      });
      if (user.invitationId) {
        await this.invitationService.remove(user.invitationId);
      }
      /**
       * create predefined data on background
       */
      this.createPredefinedData(userFromDb);
      return userFromDb;
    } catch (e) {
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException('Email or phone number already exist');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async forgotPwd(forgotPwdData: ForgotPwdDto) {
    const user = await this.userService.findByEmail(forgotPwdData.email);
    if (!user) throw new BadRequestException('User not found');

    await this.ForgotPwdRequests.remove({ user: user._id });

    const forgotPwd = new this.ForgotPwdRequests({
      user: user._id,
      token: uuidv4(),
    });
    const reqFromDb = await forgotPwd.save();
    const email = await this.mailService.sendResetMail(
      {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      reqFromDb.token,
    );

    return { idOfRequest: forgotPwd._id, email };
  }
  async resetPwd(resetPwdData: ResetPwdDto) {
    const request = await this.ForgotPwdRequests.findOne({
      token: resetPwdData.resetToken,
    }).populate('user');

    if (!request) throw new BadRequestException('Request not found');
    if (DateTimeHelper.isExpired(request.createdAt, 1, 'day'))
      throw new BadRequestException('Request has been expired');

    const updatedUser = await this.userService.update(request.user._id, {
      password: resetPwdData.password,
    });

    await this.ForgotPwdRequests.findByIdAndRemove(request._id);
    return updatedUser;
  }

  private createPredefinedData(userFromDb: User) {
    // this.rs.createPredefinedRoutines(userFromDb);
    this.rs.createAdminUserRoutines(userFromDb);
    // this.rewardService.createPredefinedRewards(userFromDb);
    this.rewardService.createAdminUserRewards(userFromDb);
    this.behaviorService.createPredefinedBehaviors(userFromDb);
    // this.quizletService.createPredefinedQuizlets(userFromDb);
    this.referralService.assignCodeToUser(userFromDb);
  }

  async newCheckoutWithRecurly(newCheckoutDto: NewCheckoutDto) {
    try {
      // console.log('newCheckoutWithRecurly', JSON.stringify(newCheckoutDto));
      const { shippingInfo } = newCheckoutDto;
      let userFromDb: User;
      const fieldsToUpdate: Partial<User> = {};
      let isExistingUser = true;
      if (newCheckoutDto.userId) {
        userFromDb = await this.userService.findById(newCheckoutDto.userId);
      } else {
        userFromDb = await this.userService.findByEmail(shippingInfo.email);
        if (!userFromDb) {
          isExistingUser = false;
          userFromDb = await this.userService.create({
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            email: shippingInfo.email,
            address: shippingInfo.address,
            country: shippingInfo.country,
            postalCode: shippingInfo.postal,
            apt: shippingInfo.apt || null,
            clients: [],
            state: shippingInfo.state,
            city: shippingInfo.city,
            phoneNumber: shippingInfo.phone,
          });
          this.createPredefinedData(userFromDb);
        }
      }

      //update existing user with latest info
      if (isExistingUser) {
        fieldsToUpdate.address = shippingInfo.address;
        fieldsToUpdate.country = shippingInfo.country;
        fieldsToUpdate.postalCode = shippingInfo.postal;
        fieldsToUpdate.apt = shippingInfo.apt || null;
        fieldsToUpdate.state = shippingInfo.state;
        fieldsToUpdate.city = shippingInfo.city;
        fieldsToUpdate.phoneNumber = shippingInfo.phone;
      }

      if (
        newCheckoutDto.referralCode &&
        newCheckoutDto.paymentMedium === PAYMENT_MEDIUMS.MAIL_A_CHEQUE
      ) {
        if (newCheckoutDto.currency == 'USD')
          throw new BadRequestException(
            `referral code cannot be used for mail a check option`,
          );
        else
          throw new BadRequestException(
            `referral code cannot be used for mail a cheque option`,
          );
      }
      if (newCheckoutDto.referralCode) {
        await this.addReferralCode(newCheckoutDto.referralCode, userFromDb);
      }

      const planName = newCheckoutDto.plansInfo[0].planCode;
      fieldsToUpdate.plan = planName;

      const accountCreated = await this.recurly.createAccount(
        newCheckoutDto,
        userFromDb,
      );
      fieldsToUpdate.recurlyCustomerId = accountCreated.id;
      fieldsToUpdate.paymentMethod = newCheckoutDto.paymentMedium;

      if (newCheckoutDto.paymentMedium !== PAYMENT_MEDIUMS.MAIL_A_CHEQUE) {
        const invoiceCollection = await this.recurly.createPurchase(
          newCheckoutDto,
          userFromDb,
        );

        //if card is 3d secure, send reponse of 3d token back to client
        if (invoiceCollection instanceof TransactionError)
          return invoiceCollection;

        const { chargeInvoice } = invoiceCollection;
        if (
          chargeInvoice.transactions &&
          chargeInvoice.transactions.length > 0
        ) {
          const transaction = chargeInvoice.transactions[0];
          if (transaction && transaction.paymentMethod) {
            fieldsToUpdate.last4 = transaction.paymentMethod.lastFour;
          }
        }
        await this.saveSubscriptionsInDB(invoiceCollection, userFromDb);
      } else {
        const invoiceCollection = await this.recurly.createPurchaseWithoutToken(
          newCheckoutDto,
          userFromDb,
        );
        await this.saveSubscriptionsInDB(invoiceCollection, userFromDb);
      }
      const { token } = await this.sessionsService.create(userFromDb._id);

      const updatedUser = await this.userService.update(
        userFromDb._id,
        fieldsToUpdate,
      );
      return {
        user: { ...updatedUser.toObject() },
        token,
        isExistingUser,
        paymentMedium: newCheckoutDto.paymentMedium,
      };
    } catch (e) {
      if (isDuplicateMongoError(e.code)) {
        throw new BadRequestException('Phone Number already exist');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async addReferralCode(referralCode: string, user: User) {
    const referral = await this.referralService.getReferralByCode(referralCode);

    if (referral && referral.userId) {
      const redemptions = referral.redemptions.filter(
        redemption => redemption.redeemedBy.toString() == user._id.toString(),
      );

      if (referral.userId.toString() == user._id.toString())
        throw new BadRequestException(
          `referral code cannot be used for same account from where it belongs to`,
        );
      else if (redemptions.length > 0)
        throw new BadRequestException(
          `referral code ${referralCode} is already used by ${user._id}`,
        );
      else await this.referralService.addRedeemedBy(referralCode, user);
    }
  }

  async saveSubscriptionsInDB(
    invoiceCollection: InvoiceCollection,
    user: User,
  ) {
    await BB.map(
      invoiceCollection.chargeInvoice.subscriptionIds,
      async subscriptionId => {
        const recurlyInvoiceNumber = invoiceCollection.chargeInvoice.number;
        const subFromRecurly = await this.recurly.getSubscriptionById(
          subscriptionId,
        );
        const invoicedListItems = (
          invoiceCollection.chargeInvoice.lineItems || []
        )
          .filter(item => item.subscriptionId == subscriptionId)
          .map(item => ({
            priceId: item.amount.toString(),
            itemId: item.description,
          }));

        if (subFromRecurly.plan.code != RECURLY_PLANS.DEVICE_REPLACEMENT) {
          let coupon = '';
          if (
            subFromRecurly.couponRedemptions &&
            subFromRecurly.couponRedemptions[0] &&
            subFromRecurly.couponRedemptions[0].coupon
          ) {
            coupon = subFromRecurly.couponRedemptions[0].coupon.code;
          }

          let deviceColor = RECURLY_ITEMS.USE_MY_OWN_DEVICE;
          if (subFromRecurly.customFields.length > 0)
            deviceColor = subFromRecurly.customFields[0].value;

          await this.subscriptionService.createGoallySubscription(
            subscriptionId,
            subFromRecurly.uuid,
            recurlyInvoiceNumber,
            user,
            invoicedListItems,
            subFromRecurly.plan.code,
            user.address,
            deviceColor,
            null,
            RECURLY,
            subFromRecurly.state,
            subFromRecurly.currentPeriodStartedAt,
            subFromRecurly.currentPeriodEndsAt,
            subFromRecurly.collectionMethod,
            coupon,
          );
        }
      },
    );
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    if (sendOtpDto.phone_number) {
      const phoneNumber = await this.userService.isEmailOrPhoneNumberExists(
        '',
        sendOtpDto.phone_number,
      );
      if (!phoneNumber.isExists)
        throw new BadRequestException(
          `phone number ${sendOtpDto.phone_number} is not registered`,
        );
    }
    if (sendOtpDto.email) {
      const email = await this.userService.isEmailOrPhoneNumberExists(
        sendOtpDto.email,
        '',
      );
      if (!email.isExists)
        throw new BadRequestException(
          `email ${sendOtpDto.email} is not registered`,
        );
    }
    const sendOtpBody = this.getOtpBody(sendOtpDto);
    try {
      const auth0Response$ = this.http.post(AUTH0.SEND_OTP_URL, sendOtpBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const auth0ResponseValue = await lastValueFrom(auth0Response$);
      return auth0ResponseValue.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAccessToken(getAccessTokenDto: GetAccessTokenDto) {
    const getAccessTokenBody = this.getAccessTokenBody(getAccessTokenDto);

    try {
      const auth0Response$ = this.http.post(
        AUTH0.ACCESS_TOKEN_URL,
        getAccessTokenBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const auth0ResponseValue = await lastValueFrom(auth0Response$);
      return auth0ResponseValue.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  getOtpBody(sendOtpDto: SendOtpDto) {
    const otpBody = {
      ...sendOtpDto,
      send: OTP_TYPE.CODE,
    };

    Object.assign(otpBody, this.getAuth0AppCredentials(sendOtpDto.app));

    delete otpBody.app;

    return otpBody;
  }

  getAccessTokenBody(getAccessTokenDto: GetAccessTokenDto) {
    const accessTokenBody = {
      ...getAccessTokenDto,
      grant_type: AUTH0.GRANT_TYPE_OTP_URL,
    };

    Object.assign(
      accessTokenBody,
      this.getAuth0AppCredentials(getAccessTokenDto.app),
    );

    delete accessTokenBody.app;

    return accessTokenBody;
  }

  getAuth0AppCredentials(app: string) {
    switch (app) {
      case APPS.WEBPORTAL:
        return {
          client_id: this.config.get('AUTH0_WP_CLIENT_ID'),
          client_secret: this.config.get('AUTH0_WP_CLIENT_SECRET'),
        };

      case APPS.CTA:
        return {
          client_id: this.config.get('AUTH0_CTA_CLIENT_ID'),
          client_secret: this.config.get('AUTH0_CTA_CLIENT_SECRET'),
        };

      default:
        throw new BadRequestException(`${app} is not supported yet.`);
    }
  }

  async addMissingSubscription(missingSubDto: MissingSubscriptionDto) {
    const user = await this.userService.findByEmail(missingSubDto.email);
    if (!user)
      throw new BadRequestException(
        `user with email ${missingSubDto.email} not found`,
      );
    const missingSubscription = await this.addMissingSubscriptionsInDB(
      missingSubDto,
      user,
    );
    return missingSubscription;
  }

  async addMissingSubscriptionsInDB(
    missingSubDto: MissingSubscriptionDto,
    user: User,
  ) {
    const recurlyInvoiceNumber = missingSubDto.invoiceNumber;
    const subscriptionId = missingSubDto.subscriptionId;

    const subFromRecurly = await this.recurly.getSubscriptionById(
      subscriptionId,
    );
    const invoiceFromRecurly = await this.recurly.getInvoiceDetails(
      recurlyInvoiceNumber,
    );

    const invoicedListItems = (invoiceFromRecurly.lineItems || [])
      .filter(item => item.subscriptionId == subscriptionId)
      .map(item => ({
        priceId: item.amount.toString(),
        itemId: item.description,
      }));

    if (subFromRecurly.plan.code != RECURLY_PLANS.DEVICE_REPLACEMENT) {
      let coupon = '';
      if (
        subFromRecurly.couponRedemptions &&
        subFromRecurly.couponRedemptions[0] &&
        subFromRecurly.couponRedemptions[0].coupon
      ) {
        coupon = subFromRecurly.couponRedemptions[0].coupon.code;
      }

      let deviceColor = RECURLY_ITEMS.USE_MY_OWN_DEVICE;
      if (subFromRecurly.customFields.length > 0)
        deviceColor = subFromRecurly.customFields[0].value;

      await this.subscriptionService.createGoallySubscription(
        subscriptionId,
        subFromRecurly.uuid,
        recurlyInvoiceNumber,
        user,
        invoicedListItems,
        subFromRecurly.plan.code,
        user.address,
        deviceColor,
        null,
        RECURLY,
        subFromRecurly.state,
        subFromRecurly.currentPeriodStartedAt,
        subFromRecurly.currentPeriodEndsAt,
        subFromRecurly.collectionMethod,
        coupon,
      );
    }
  }

  async acceptInviteByCode(user: User, code: string) {
    if (!code) throw new BadRequestException('code is required');
    const invite = await this.invitationService.getInviteByCode(code);
    if (!invite) throw new BadRequestException('invite not found');
    const client = await this.clientService.findById(invite.assignedClient);
    if (!client) throw new BadRequestException('client not found');

    if (
      (user.clients as Types.ObjectId[]).find(
        clientId => clientId.toString() === invite.assignedClient.toString(),
      )
    )
      throw new BadRequestException(
        `${user.firstName} ${user.lastName} is already care team member of ${client.firstName}'s user profile`,
      );

    return this.invitationFlow(user, invite._id);
  }
}

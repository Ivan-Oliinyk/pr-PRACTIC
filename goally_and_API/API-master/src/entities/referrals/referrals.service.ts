import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { flatten } from 'lodash';
import { Model } from 'mongoose';
import * as path from 'path';
import { RecurlyService } from 'src/shared/recurly/recurly.service';
import { User } from '../users/schema';
import { UsersService } from '../users/users.service';
import { Referrals } from './schema/referrals.schema';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel(Referrals.name) private ReferralModel: Model<Referrals>,
    private recurlyClient: RecurlyService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  private basePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'static',
  );
  private redeemCodesPath = path.resolve(this.basePath, 'grants');
  private CODES_LIST = 'referral_codes.csv';

  async getRedeemedDetails(user: User) {
    const referral = await this.ReferralModel.findOne({ userId: user._id });
    if (!referral)
      throw new BadRequestException(`no referral code exists for ${user._id}`);

    const subscriptionLookup = {
      from: 'subscriptions',
      localField: 'referralCode',
      foreignField: 'couponUsed',
      as: 'subscriptions',
    };
    const usersLookUps = {
      from: 'users',
      localField: 'subscriptions.payer',
      foreignField: '_id',
      as: 'users',
    };
    const redeemedDetails = this.ReferralModel.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $lookup: subscriptionLookup,
      },
      {
        $lookup: usersLookUps,
      },
      {
        $project: {
          _id: 1,
          redemptions: 1,
          referralCode: 1,
          userId: 1,
          subscriptions: '$subscriptions',
          users: '$users',
        },
      },
      {
        $unset: [
          'users.password',
          'users.paymentMethod',
          'users.clients',
          'users.email',
          'users.type',
          'users.state',
          'users.country',
          'users.updatedAt',
          'users.createdAt',
          'users.address',
          'users.postalCode',
          'subscriptions.shippingAddress',
          'subscriptions.prices',
          'subscriptions.sku',
          'subscriptions.client',
          'subscriptions.subscriptionToken',
          'subscriptions.color',
          'subscriptions.subscriptionType',
        ],
      },
      { $limit: 100 },
    ]);

    return redeemedDetails;
  };

  async getUserReferralCode(user: User) {
    const referral = await this.ReferralModel.findOne({ userId: user._id });
    if (!referral)
      throw new BadRequestException(`no referral code exists for ${user._id}`);
    return referral;
  }

  async getUserDetailsByReferralCode(user: User, code: string) {
    const referral = await this.ReferralModel.findOne({ referralCode: code });
    if (!referral)
      throw new BadRequestException(`no referral code exists with ${code}`);
    if (!referral.userId)
      throw new BadRequestException(
        `referral code ${code} is not assigned to any user`,
      );
    const userFromDB = await this.userService.findById(referral.userId);
    return { firstName: userFromDB.firstName, lastName: userFromDB.lastName };
  }

  async getReferralByCode(code: string) {
    const referral = await this.ReferralModel.findOne({ referralCode: code });
    return referral;
  }

  async addRedeemedBy(code: string, user: User) {
    const referral = await this.ReferralModel.findOneAndUpdate(
      { referralCode: code },
      {
        $addToSet: { redemptions: { redeemedBy: user._id, amountEarned: 0 } },
      },
      { new: true },
    );
    return referral;
  }

  async assignCodeToUser(user: User) {
    const userReferral = await this.ReferralModel.findOneAndUpdate(
      { userId: null },
      { userId: user._id },
      { new: true },
    );

    if (!userReferral.userId)
      throw new BadRequestException('no user Id value for referral');
    this.recurlyClient.addReferralCodeInRecurly(userReferral);
    return userReferral;
  }

  async addReferralCodes() {
    try {
      let codes: any[] = await this.readCsvAsync(
        path.resolve(this.redeemCodesPath, this.CODES_LIST),
      );
      codes = codes.map(e => {
        const [ref_code] = Object.values(e);
        return {
          referralCode: ref_code,
        };
      });
      await this.ReferralModel.remove({});
      const codesFromDb = await this.ReferralModel.insertMany(flatten(codes));
      return { success: true };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  private readCsvAsync(path): Promise<Array<any>> {
    return new Promise((res, rej) => {
      const data = [];
      const rs = fs.createReadStream(path);
      rs.on('error', () => res([]));
      rs.pipe(csv.parse({ headers: true }))
        .on('error', () => res([]))
        .on('data', row => {
          data.push(row);
        })
        .on('end', () => res(data));
    });
  }

  async getGoallyGrantsReport() {
    const goallyGrants = await this.ReferralModel.aggregate([
      { $match: { redemptions: { $exists: true, $type: 'array', $ne: [] } } },
      {
        $unwind: {
          path: '$redemptions',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'giverDetails',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'userId',
          foreignField: 'payer',
          as: 'giverSubscription',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'redemptions.redeemedBy',
          foreignField: '_id',
          as: 'receiverDetails',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'redemptions.redeemedBy',
          foreignField: 'payer',
          as: 'receiverSubscription',
        },
      },
      {
        $unset: [
          '_id',
          'redemptions',
          '__v',
          'createdAt',
          'updatedAt',
          'userId',
          'giverDetails.last4',
          'giverDetails.paymentMethod',
          'giverDetails.recurlyCustomerId',
          'giverDetails.stripeCustomerId',
          'giverDetails.plan',
          'giverDetails.clients',
          'giverDetails.migrated',
          'giverDetails.password',
          'giverDetails.country',
          'giverDetails.postalCode',
          'giverDetails.type',
          'giverDetails.address',
          'giverDetails.state',
          'giverDetails.apt',
          'giverDetails.city',
          'giverDetails.phoneNumber',
          'giverDetails.completedTiles',
          'giverDetails.updatedAt',
          'receiverDetails.last4',
          'receiverDetails.paymentMethod',
          'receiverDetails.recurlyCustomerId',
          'receiverDetails.stripeCustomerId',
          'receiverDetails.plan',
          'receiverDetails.clients',
          'receiverDetails.migrated',
          'receiverDetails.password',
          'receiverDetails.country',
          'receiverDetails.postalCode',
          'receiverDetails.type',
          'receiverDetails.address',
          'receiverDetails.state',
          'receiverDetails.apt',
          'receiverDetails.city',
          'receiverDetails.phoneNumber',
          'receiverDetails.completedTiles',
          'receiverDetails.updatedAt',
          'giverSubscription._id',
          'giverSubscription.client',
          'giverSubscription.subscriptionToken',
          'giverSubscription.sku',
          'giverSubscription.payer',
          'giverSubscription.prices',
          'giverSubscription.shippingAddress',
          'giverSubscription.color',
          'giverSubscription.subscriptionType',
          'giverSubscription.__v',
          'giverSubscription.updatedAt',
          'receiverSubscription._id',
          'receiverSubscription.client',
          'receiverSubscription.subscriptionToken',
          'receiverSubscription.sku',
          'receiverSubscription.payer',
          'receiverSubscription.prices',
          'receiverSubscription.shippingAddress',
          'receiverSubscription.color',
          'receiverSubscription.subscriptionType',
          'receiverSubscription.__v',
          'receiverSubscription.updatedAt',
        ],
      },
      {
        $project: {
          referralCode: '$referralCode',
          giverDetails: { $arrayElemAt: ['$giverDetails', 0] },
          receiverDetails: { $arrayElemAt: ['$receiverDetails', 0] },
          giverSubscription: { $arrayElemAt: ['$giverSubscription', 0] },
          receiverSubscription: { $arrayElemAt: ['$receiverSubscription', 0] },
        },
      },
    ]);

    if (!goallyGrants)
      throw new BadRequestException(
        `Data is not available for Goally Grants Report`,
      );
    return goallyGrants;
  }
}

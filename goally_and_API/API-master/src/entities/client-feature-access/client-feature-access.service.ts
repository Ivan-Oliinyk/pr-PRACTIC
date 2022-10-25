import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { FreeFeatures } from './const/freePlanFeature.access';
import { HomeFeatures } from './const/homeTherapy.access';
import { ProFeatures } from './const/proTherapy.access';
import { CreateClientFeatureAccessDto } from './dto/create-client-feature.dto';
import { ClientFeatureAccess } from './schema/client-feature-access.schema';
@Injectable()
export class ClientFeatureAccessService {
  constructor(
    @InjectModel(ClientFeatureAccess.name)
    private clientFeatureAccess: Model<ClientFeatureAccess>,
  ) {}
  async create(clientId: Types.ObjectId, plan: USER_PLANS = USER_PLANS.FREE) {
    let accessData: CreateClientFeatureAccessDto = FreeFeatures;
    switch (plan) {
      case USER_PLANS.FREE:
        accessData = FreeFeatures;
        break;

      case USER_PLANS.PRO_THERAPY_SUITE_DEVICE:
        accessData = ProFeatures;
        break;

      case USER_PLANS.THERAPY_SUITE:
        accessData = HomeFeatures;
        break;

      case USER_PLANS.HTS_ONLY_MONTHLY:
        accessData = HomeFeatures;
        break;
      case USER_PLANS.HTS_DEVICE_MONTHLY:
        accessData = HomeFeatures;
        break;

      case USER_PLANS.HTS_ONLY_PREPAID_36:
        accessData = HomeFeatures;
        break;
      case USER_PLANS.HTS_DEVICE_PREPAID_36:
        accessData = HomeFeatures;
        break;

      case USER_PLANS.HTS_ONLY_PREPAID_12:
        accessData = HomeFeatures;
        break;
      case USER_PLANS.HTS_DEVICE_PREPAID_12:
        accessData = HomeFeatures;
        break;

      case USER_PLANS.HTS_ONLY_PREPAID_24:
        accessData = HomeFeatures;
        break;
      case USER_PLANS.HTS_DEVICE_PREPAID_24:
        accessData = HomeFeatures;
        break;

      case USER_PLANS.SITE_LICENSE:
        accessData = ProFeatures;
        break;

      default:
        accessData = FreeFeatures;
    }
    const feature = new this.clientFeatureAccess({
      ...accessData,
      client: clientId,
    });
    await feature.save();
  }

  async update(id: Types.ObjectId, data: Partial<ClientFeatureAccess>) {
    const updatedData = await this.clientFeatureAccess.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );
    return updatedData;
  }
  async findById(id: Types.ObjectId) {
    return this.clientFeatureAccess.findById(id);
  }
  async findByClientId(clientId: Types.ObjectId) {
    return this.clientFeatureAccess.findOne({ client: clientId });
  }
}

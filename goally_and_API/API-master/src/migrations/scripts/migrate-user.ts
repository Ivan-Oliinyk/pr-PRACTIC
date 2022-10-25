import * as bb from 'bluebird';
import * as fs from 'fs';
import { head, omit } from 'lodash';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import RRule, { Weekday } from 'rrule';
import { Activity } from 'src/entities/activities/schema/activity.schema';
import {
  Behavior,
  BehaviorSchema,
} from 'src/entities/behavior/schema/behavior.schema';
import {
  Client,
  ClientSchema,
} from 'src/entities/clients/schema/client.schema';
import { Device, DeviceSchema } from 'src/entities/devices/schemas';
import { Images, ImagesSchema } from 'src/entities/images/schema/image.schema';
import {
  Reward,
  RewardSchema,
} from 'src/entities/rewards/schema/reward.schema';
import {
  DayTime,
  Routine,
  RoutineSchema,
} from 'src/entities/routines/schema/routine.schema';
import { User, UserSchema } from 'src/entities/users/schema';
import { LIBRARY_TYPES, STATUSES, USER_TYPES } from 'src/shared/const';
import { DIAGNOSIS } from 'src/shared/const/client-diagnosis';
import { ROUTINES_TYPE } from 'src/shared/const/routine-type';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { OldActivities } from '../old-models/activities';
import { OldBehaviors } from '../old-models/behaviors';
import { OldChild } from '../old-models/childs';
import { OldDevice } from '../old-models/device_map';
import { OldDiagnosis } from '../old-models/diagnosis';
import { oldPoints } from '../old-models/points';
import { OldRewards } from '../old-models/rewards';
import { OldRoutines } from '../old-models/routines';
import { OldUsers } from '../old-models/users';
import { OldUserIcons } from '../old-models/user_icons';
import { OldBehaviorType } from '../old-types/OldBehavior';
import { OldClientType } from '../old-types/OldClient';
import { OldRewardType } from '../old-types/OldReward';
import { OldRoutineType } from '../old-types/OldRoutine';
import { OldUserType } from '../old-types/OldUser';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const round10 = require('round10').round10;

const connect = mongoose.createConnection(process.env.MIGRATION_NEW_DB || '');
const NewUserModel = connect.model<User>(User.name, UserSchema);
const NewClientModel = connect.model<Client>(Client.name, ClientSchema);
const NewDeviceModel = connect.model<Device>(Device.name, DeviceSchema);
const NewRewardModel = connect.model<Reward>(Reward.name, RewardSchema);
const NewBehaviorModel = connect.model<Behavior>(Behavior.name, BehaviorSchema);
const NewRoutineModel = connect.model<Routine>(Routine.name, RoutineSchema);

const NewImageModel = connect.model<Images>(Images.name, ImagesSchema);
const emails = [
  'biddulphfamily@gmail.com',
  'greenfrogs12345@gmail.com',
  'k_nicolet@yahoo.com',
  'najeebidrees@gmail.com',
  'rebecca.c.barry@gmail.com',
  'sarahmp728@gmail.com',
  'sheseala@gmail.com',
  'shtern.sasha@gmail.com',
  'kimcconsultation@gmail.com',
  'bec8203@yahoo.com.au',
  'emilygcrittenden@gmail.com',
  'ernnicole@yahoo.com',
];
export class MigrateUsers {
  static async migrateAssets() {
    const icons = await OldUserIcons.find({});
    await bb.mapSeries(icons, icon => {
      return new Promise((res, rej) => {
        fs.appendFile(
          //@ts-ignore
          `/usr/src/app/static/temp/${icon._id}.png`,
          //@ts-ignore
          Buffer.from(icon.icon, 'base64'),
          { flag: 'wx' },
          err => {
            console.log(err);
            if (err) console.log('error');
            else res('done');
            console.log('done');
          },
        );
      });
    });
  }
  static async start() {
    const devices = await NewDeviceModel.find({});
    const devices2 = await Promise.all(
      devices.map(e => {
        if (e.migrated) {
          e.appId = 'testgoally.com.testgoally';
        } else {
          e.appId = 'com.getgoally.learnerapp';
        }
        return e.save();
      }),
    );
    return devices2;
    // const routines = await NewRoutineModel.find({});
    // const routines2 = await Promise.all(
    //   routines.map(e => {
    //     e.numberOfPointsLate = round10(e.numberOfPointsLate, 1);
    //     e.numberOfPointsOnTime = round10(e.numberOfPointsOnTime, 1);
    //     return e.save();
    //   }),
    // );
    // return routines2;

    const migrateFrom = moment(new Date('3.1.2020'));
    const filter = {
      $or: [{ 'emails.address': { $in: emails } }],
    };
    const totalActiveUsers = await OldUsers.count(filter);
    console.log('totalActiveUsers', totalActiveUsers);
    const total = totalActiveUsers || 20;
    const series = 10;
    const arrayLength = total;

    try {
      const users = await bb.mapSeries(
        new Array(arrayLength),
        async (elem, index) => {
          //@ts-ignore
          const users: OldUserType[] = await OldUsers.find(filter)
            .limit(series)
            .skip(series * index);
          return await this.formatOldUsersToNew(users);
        },
      );
      return users;
    } catch (e) {
      return e;
    }
  }
  static async formatOldUsersToNew(users: OldUserType[]) {
    console.log('formatOldUsersToNew', users.length);
    const formattedUsers = await bb.mapSeries(users, async (user, index) => {
      console.log('user Index', index);
      try {
        const emails = user.emails.map(e => e.address);
        const existingUsers = await NewUserModel.find({
          email: { $in: emails },
        });
        console.log(existingUsers);
        if (existingUsers.length) {
          return await this.updateExistingUsers(existingUsers);
        } else {
          return await this.createNewUser(user);
        }
      } catch (e) {
        console.log(e);
      }
    });
    return formattedUsers;
  }
  static async updateExistingUsers(existingUsers: User[]) {
    return await bb.mapSeries(existingUsers, async newUser => {
      //@ts-ignore
      const oldUser: OldUserType = await OldUsers.findOne({
        'emails.address': newUser.email,
      });

      const oldUserClients = await OldChild.find({ parentId: oldUser._id });

      await bb.mapSeries(oldUserClients, async oldClient => {
        //@ts-ignore
        const oldRewards: OldRewardType[] = await OldRewards.find({
          //@ts-ignore
          userId: oldClient._id,
          isDeleted: false,
        }).sort('rank');
        await bb.mapSeries(oldRewards, async oldReward => {
          const filter = {
            name: oldReward.name,
            points: round10(oldReward.points, 1),
            //@ts-ignore
            createdAt: oldReward.createdAt,
            createdBy: newUser._id,
            // libraryType: LIBRARY_TYPES.ADULT,
          };
          //@ts-ignore
          const newRewardsCount = await NewRewardModel.count(filter);
          //@ts-ignore
          const newRewards = await NewRewardModel.find(filter);
          await bb.mapSeries(newRewards, async newReward => {
            newReward.imgURL = await this.getImageLink(oldReward.icon);
            await newReward.save();
          });

          // console.log(oldReward.name, newRewardsCount);
        });
        //@ts-ignore
        const oldRoutines: OldRoutineType[] = await OldRoutines.find({
          //@ts-ignore
          userId: oldClient._id,
          isDeleted: false,
        }).sort('rank');
        /**
         *
         */
        await bb.mapSeries(oldRoutines, async (oldRoutine, index) => {
          const activities = await this.migrateActivity(
            //@ts-ignore
            oldClient,
            newUser,
            oldRoutine,
          );
          const routinePoints = oldRoutine.points
            ? Math.trunc(oldRoutine.points)
            : 0;

          const filter = {
            name: oldRoutine.title,
            createdBy: newUser._id,
            numberOfPointsOnTime: oldRoutine.points || 0,
            numberOfPointsLate: oldRoutine.points || 0,
          };
          if (activities.length) {
            filter['activities.name'] = activities[0].name;
            filter['activities.createdAt'] = activities[0].createdAt;
          }

          const numberOfPointsOnTime =
            routinePoints + activities.reduce((sum, a) => sum + a.points, 0);
          const numberOfPointsLate = Math.trunc(numberOfPointsOnTime / 2);

          //@ts-ignore
          const newRoutinesCount = await NewRoutineModel.count(filter);
          //@ts-ignore
          const newRoutines = await NewRoutineModel.find(filter);
          await bb.mapSeries(newRoutines, async newRoutine => {
            newRoutine.imgURL = await this.getImageLink(oldRoutine.icon);
            newRoutine.numberOfPointsOnTime = round10(numberOfPointsOnTime, 1);
            newRoutine.numberOfPointsLate = round10(numberOfPointsLate, 1);
            newRoutine.activities = newRoutine.activities.map(e => {
              const act = activities.find(
                oldActivity => oldActivity.name == e.name,
              );
              if (act) {
                e.imgURL = act.imgURL;
              }
              return e;
            });
            await newRoutine.save();

            const childRoutines = await NewRoutineModel.find({
              parentRoutineId: newRoutine._id,
            });

            await bb.mapSeries(childRoutines, async childRoutine => {
              childRoutine.imgURL = await this.getImageLink(oldRoutine.icon);
              childRoutine.numberOfPointsOnTime = round10(
                numberOfPointsOnTime,
                1,
              );
              childRoutine.numberOfPointsLate = round10(numberOfPointsLate, 1);
              childRoutine.activities = childRoutine.activities.map(e => {
                const act = activities.find(
                  oldActivity => oldActivity.name == e.name,
                );
                const parentActivity = newRoutine.activities.find(
                  oldActivity => oldActivity.name == e.name,
                );
                if (act) {
                  e.imgURL = act.imgURL;
                }
                if (parentActivity) {
                  e.parentActivityId = parentActivity._id;
                }
                return e;
              });
              await childRoutine.save();
            });
          });
          console.log(oldRoutine.title, newRoutinesCount);
        });
      });
    });
  }
  static async createNewUser(user: OldUserType) {
    try {
      if (!head(user.emails)) return;
      console.log('try createNewUser');
      const newUser: User = new NewUserModel({
        email: head(user.emails).address,
        firstName: user.profile.parent_name.split(' ')[0],
        lastName: user.profile.parent_name.split(' ')[1],
        password: user.services.password.bcrypt,
        phoneNumber: user.profile.phone_number,
        plan: USER_PLANS.FREE,
        status: user.isActive ? STATUSES.ACTIVE : STATUSES.DISABLED,
        type: USER_TYPES.PARENT,
        postalCode: user.profile.weatherLoc,
        country: user.profile.country === 'au' ? 'Australia' : 'United States',
        organization: null,
        stripeToken: null,
        stripeCustomerId: null,
        paymentMethod: null,
        subscription: null,
        last4: null,
        createdAt: user.createdAt,
        migrated: true,
      });
      const clients = await this.createClients(user);
      newUser.clients = clients.map(e => e.newClient._id);
      const createdUser = await newUser.save();

      await bb.mapSeries(clients, async client => {
        const rewards = await this.migrateRewards(
          //@ts-ignore
          client.oldClient,
          client.newClient,
          createdUser,
        );
        const behaviors = await this.migrateBehavior(
          client.oldClient,
          client.newClient,
          createdUser,
        );
        const routine = await this.migrateRoutine(
          client.oldClient,
          client.newClient,
          createdUser,
        );
      });

      return createdUser;
    } catch (e) {
      console.log('createdUser Error:');
      console.log(e);
    }
  }

  static async createClients(user: OldUserType) {
    console.log(' try createClients');
    const oldUserClients = await OldChild.find({ parentId: user._id });
    return await bb.mapSeries(oldUserClients, async oldClient => {
      const newClient = await this.createClient(oldClient, user);

      return { oldClient, newClient };
    });
  }
  static async createClient(oldClient, user: OldUserType) {
    try {
      console.log(' try createClient');
      const newUserClient = {
        firstName: oldClient.name.split(' ')[0],
        lastName: oldClient.name.split(' ')[1],
        createdAt: oldClient.createdAt,
        timezone: user.profile.timezone,
        country: user.profile.country === 'au' ? 'Australia' : 'United States',
        points: 0,
        device: undefined,
        diagnosis: '',
      };
      //@ts-ignore
      const points: {
        points: number;
      } = await oldPoints.findOne({
        userId: oldClient._id,
      });
      newUserClient.points = points?.points || newUserClient.points;
      const device = await this.createDevice(oldClient, user);
      newUserClient.device = device ? device._id : undefined;

      const diagnosis = await this.formatDiagnosis(oldClient, user);

      newUserClient.diagnosis = diagnosis;

      const newClient = new NewClientModel(newUserClient);
      const createdClient = newClient.save();
      return createdClient;
    } catch (e) {
      console.log('createClient Error:');
      console.log(e);
    }
  }

  static async createDevice(oldClient, user: OldUserType) {
    console.log(' try createDevice');
    console.log(oldClient.deviceMapId);
    try {
      //@ts-ignore
      const oldDevice: OldDeviceType = await OldDevice.findOne({
        _id: oldClient.deviceMapId,
      });
      if (!oldDevice) return null;
      let version: string | number = oldDevice.upgrade || oldDevice.fw_ver;
      version = version.replace('android-', '');
      const n = version.lastIndexOf('.');
      version = Number(version.slice(0, n) + version.slice(n).replace('.', ''));
      const newDevice = {
        code: oldDevice.key,
        uniqIdentifier: oldDevice.device_id,
        fcmToken: oldDevice.fcmToken,
        appVersion: version,
        batteryLevel: oldDevice.level,
        migrated: true,
        appId: 'testgoally.com.testgoally',
      };
      const device = new NewDeviceModel(newDevice);
      return device.save();
    } catch (e) {
      console.log('createDevice Error:');
      console.log(e);
    }
  }

  static async formatDiagnosis(oldClient, user: OldUserType) {
    //@ts-ignore
    const oldClientDiagnosis: {
      diagnosis: string[];
    } = await OldDiagnosis.findOne({
      childId: oldClient._id,
    });

    if (!oldClientDiagnosis || !oldClientDiagnosis.diagnosis)
      return DIAGNOSIS.NO_DIAGNOSIS;
    const existingDiagnosis = oldClientDiagnosis.diagnosis.toString();
    const SYSTEM_DIAGNOSIS = Object.values(DIAGNOSIS);

    const newDiagnose =
      SYSTEM_DIAGNOSIS.find(e => {
        return existingDiagnosis.toLowerCase().includes(e.toLowerCase());
      }) || DIAGNOSIS.OTHER;
    return newDiagnose;
  }

  static async migrateRewards(
    oldClient: OldClientType,
    newClient: Client,
    user: User,
  ) {
    //@ts-ignore
    const oldRewards: OldRewardType[] = await OldRewards.find({
      userId: oldClient._id,
      isDeleted: false,
    }).sort('rank');
    await bb.mapSeries(
      oldRewards,
      async (oldReward: OldRewardType, index: number) => {
        const imgURL: string = await this.getImageLink(oldReward.icon);
        const baseData = {
          name: oldReward.name,
          points: round10(oldReward.points, 1),
          allowRedeem: oldClient.goally.redeemOnGoally,
          showOnDevice: oldReward.isEnabled,
          createdAt: oldReward.createdAt,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
          migrated: true,
          imgURL,
        };
        //@ts-ignore
        const newAdultReward: Reward = new NewRewardModel({
          ...baseData,
        });

        const createdAdultReward = await newAdultReward.save();
        //@ts-ignore
        const newChildReward: Reward = new NewRewardModel({
          ...baseData,
          clientId: newClient._id,
          ordering: index,
          libraryType: LIBRARY_TYPES.CHILD,
          parentRewardId: createdAdultReward._id,
        });
        const createdChildReward = await newChildReward.save();

        return {
          createdAdultReward,
          createdChildReward,
        };
      },
    );
  }

  static async migrateBehavior(oldClient, newClient: Client, user: User) {
    //@ts-ignore
    const oldBehaviors: OldBehaviorType[] = await OldBehaviors.find({
      userId: oldClient._id,
      isDeleted: false,
    }).sort('rank');
    await bb.mapSeries(
      oldBehaviors,
      async (OldBehavior: OldBehaviorType, index: number) => {
        const imgURL: string = await this.getImageLink(OldBehavior.icon);

        const baseData = {
          name: OldBehavior.name,
          points: round10(OldBehavior.points, 1),
          createdAt: OldBehavior.createdAt,
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
          showOnDevice: OldBehavior.isEnabled || false,
          migrated: true,
        };

        //@ts-ignore
        const newAdultBehavior: Behavior = new NewBehaviorModel({
          ...baseData,
        });

        const createdAdultBehavior = await newAdultBehavior.save();
        //@ts-ignore
        const newChildBehavior: Behavior = new NewBehaviorModel({
          ...baseData,
          clientId: newClient._id,
          ordering: index,
          parentBehaviorId: newAdultBehavior._id,
          libraryType: LIBRARY_TYPES.CHILD,
        });
        const createdChildReward = await newChildBehavior.save();

        return {
          createdAdultBehavior,
          createdChildReward,
        };
      },
    );
  }

  static async migrateRoutine(oldClient, newClient: Client, user: User) {
    //@ts-ignore
    const routines: OldRoutineType[] = await OldRoutines.find({
      userId: oldClient._id,
      isDeleted: false,
    }).sort('rank');
    await bb.mapSeries(routines, async (oldRoutine, index) => {
      const imgURL: string = await this.getImageLink(oldRoutine.icon);
      if (oldRoutine.title == 'After School') {
        console.log(imgURL);
        console.log(oldRoutine.icon);
      }
      const activities = await this.migrateActivity(
        oldClient,
        user,
        oldRoutine,
      );
      const routineType =
        oldRoutine.schedule === 'INTERVAL=1;COUNT=0'
          ? ROUTINES_TYPE.MANUAL
          : ROUTINES_TYPE.SCHEDULED;
      const scheduleData = {
        type: routineType,
        schedule:
          routineType === ROUTINES_TYPE.MANUAL
            ? null
            : this.generateSchedule(oldRoutine),
      };
      const routinePoints = oldRoutine.points
        ? Math.trunc(oldRoutine.points)
        : 0;
      const numberOfPointsOnTime = round10(
        routinePoints + activities.reduce((sum, a) => sum + a.points, 0),
        1,
      );
      const numberOfPointsLate = round10(
        Math.trunc(numberOfPointsOnTime / 2),
        1,
      );
      const newRoutine: Routine = {
        ...scheduleData,
        numberOfPointsOnTime,
        numberOfPointsLate,

        imgURL,
        name: oldRoutine.title,
        createdBy: user._id,
        //@ts-ignore
        createdAt: oldRoutine.createAt,
        migrated: true,
        parentRoutineId: null,
        clientId: null,
        libraryType: LIBRARY_TYPES.ADULT,
        activities,
      };
      const savedRoutine = new NewRoutineModel(newRoutine);
      const adultRoutine = (await savedRoutine.save()).toObject();

      const newChildRoutine = omit(
        {
          ...newRoutine,
          createdBy: user._id,
          parentRoutineId: adultRoutine._id,
          clientId: newClient._id,
          libraryType: LIBRARY_TYPES.CHILD,
          ordering: index,
        },
        '_id',
      );
      const newActivities = adultRoutine.activities.map(parentActivity => {
        return omit(
          {
            ...parentActivity,
            libraryType: LIBRARY_TYPES.CHILD,
            parentActivityId: parentActivity._id,
            clientId: newClient._id,
          },
          '_id',
        );
      });
      // console.log(newActivities);
      const clientRoutine = new NewRoutineModel({
        ...newChildRoutine,
        activities: newActivities,
      });
      const savedClientRoutine = await clientRoutine.save();
      return { adultRoutine, savedClientRoutine };
    });
  }

  static async migrateActivity(
    oldClient: OldClientType,
    user: User,
    routine: OldRoutineType,
  ) {
    //@ts-ignore
    const oldActivities: OldActivitiesType[] = await OldActivities.find({
      userId: oldClient._id,
      isDeleted: false,
      routineId: routine._id,
    }).sort('rank');
    const newActivities = await bb.mapSeries(
      oldActivities,
      async (oldActivity, index) => {
        const imgURL: string = await this.getImageLink(oldActivity.icon);
        const minTime =
          isNaN(Number(oldActivity.minTime)) || Number(oldActivity.minTime) < 0
            ? 0
            : Number(oldActivity.minTime);

        const maxTime =
          isNaN(Number(oldActivity.maxTime)) || Number(oldActivity.maxTime) < 0
            ? 0
            : Number(oldActivity.maxTime);
        const points = oldActivity.bonus ? Math.trunc(oldActivity.bonus) : 0;
        //@ts-ignore
        const activity: Activity & { points: number } = {
          name: oldActivity.title,
          minCompletionTime: minTime,
          maxCompletionTime: minTime > maxTime ? minTime : maxTime,
          audioUrl: '',
          imgURL,
          createdBy: user._id,
          parentActivityId: null,
          allowCancelActivity: oldClient.goally.cancel_en,
          allowPauseActivity: oldClient.goally.pause_en,
          allowPush: oldClient.goally.skip_en,
          showTimer: true,
          libraryType: LIBRARY_TYPES.ADULT,
          migrated: true,
          ordering: index,
          //@ts-ignore
          createdAt: oldActivity.createdAt,
          points,
        };
        return activity;
      },
    );
    return newActivities;
  }

  static async getImageLink(image: string) {
    if (!image) return null;
    if (image.includes('customImage'))
      return `https://goally-files.s3.amazonaws.com/aws/migrated-data/${
        image.split('_')[1]
      }.png`;
    const imageFromNewDb = await NewImageModel.findOne({ name: image });
    if (imageFromNewDb)
      return `static/icons/${imageFromNewDb.category}/${imageFromNewDb.name}.png`;
    return null;
  }

  static generateSchedule(oldRoutine: OldRoutineType) {
    const schedule: DayTime = {
      Sun: null,
      Mon: null,
      Tue: null,
      Wed: null,
      Thu: null,
      Fri: null,
      Sat: null,
    };
    const selectedDays = [
      { key: 'Sun' },
      { key: 'Mon' },
      { key: 'Tue' },
      { key: 'Wed' },
      { key: 'Thu' },
      { key: 'Fri' },
      { key: 'Sat' },
    ];

    const routineOptions = RRule.parseString(oldRoutine.schedule);
    if (routineOptions.freq === RRule.WEEKLY) {
      (routineOptions.byweekday as Weekday[]).forEach(obj => {
        const index = this.dayToIndex(obj.weekday);
        const selectedKey = selectedDays[index].key;
        if (!selectedKey) return;
        const time = oldRoutine.advschedule[index].is_checked
          ? oldRoutine.advschedule[index].starttime
          : oldRoutine.starttime;
        schedule[selectedKey] = moment(time, ['HH:mm']).format('hh:mm A');
      });
    }

    return schedule;
  }
  static dayToIndex(day) {
    return (day + 1) % 7;
  }
}

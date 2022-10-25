import { Device } from 'src/entities/devices/schemas';
import { User } from 'src/entities/users/schema/user.schema';

export class GetSentryTags {
  static basic(status: number, createdBy: string, url: string, method: string) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      createdBy: createdBy,
      path: url,
      method: method,
    };
  }
  static user(user: User) {
    return {
      userId: user._id,
      userEmail: user.email,
      UserPlan: user.plan,
      UserStatus: user.status,
      UserType: user.type,
      UserToken: user.token,
      UserRecurlyCustomerId: user.recurlyCustomerId,
      UserSubscription: user.subscription,
      UserMigrated: user.migrated,
      UserFcmToken: user.fcmToken,
      UserIsSiteLicense: user.isSiteLicense,
      UserCreatedAt: user.createdAt.toISOString(),
    };
  }
  static device(device: Device) {
    return {
      deviceId: device._id,
      deviceUniqIdentifier: device.uniqIdentifier,
      deviceCode: device.code,
      deviceFcmToken: device.fcmToken,
      deviceAppId: device.appId,
      deviceBatteryLevel: device.batteryLevel,
      deviceWifiConnected: device.wifiConnected,
      deviceMigrated: device.migrated,
      deviceAppVersion: device.appVersion,
      deviceDesiredVersion: device.desiredVersion,
      deviceWifiStrength: device.wifiStrength,
      deviceIsConnected: device.isConnected,
      devicePlatform: device.platform,
      deviceOsVersion: device.osVersion,
      deviceManufacturer: device.manufacturer,
      deviceSku: device.sku,
      deviceImei: device.imei,
      deviceImsi: device.imsi,
      deviceActiveClientId: device.activeClientId
        ? device.activeClientId.toString()
        : null,
      deviceUserId: device.userId.toString(),
      deviceName: device.deviceName,
      deviceCreatedAt: device.createdAt.toISOString(),
    };
  }
}

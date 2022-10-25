import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DevicesService } from 'src/entities/devices/devices.service';

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(private deviceService: DevicesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const uniqIdentifier = request.headers['authorization'];
    if (!uniqIdentifier) return false;
    const device = await this.deviceService.findByUniqId(uniqIdentifier);
    if (!device) return false;
    request.device = device;
    return true;
  }
}

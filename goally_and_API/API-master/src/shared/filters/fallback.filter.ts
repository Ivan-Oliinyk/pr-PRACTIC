import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import { config } from 'src/config';
import { Device } from 'src/entities/devices/schemas/device.schema';
import { User } from 'src/entities/users/schema/user.schema';
import { GetSentryTags } from '../helper/GetSentryTags';

@Catch()
export class FallbackExpectionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(
      'fallback exception handler triggered',
      JSON.stringify(exception),
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let valid500Error = true;
    console.log('testing exception.status', exception.status);
    if (exception.status < 500) {
      valid500Error = false;
    }
    console.log('testing valid500Error', valid500Error);
    //get data required for sentry
    if (config().NODE_ENV == 'PRODUCTION' && valid500Error) {
      const request = ctx.getRequest();
      const user: User = request.user;
      const device: Device = request.device;
      const client = new SentryService();

      if (user) client.instance().setTags(GetSentryTags.user(user));
      if (device) client.instance().setTags(GetSentryTags.device(device));
      client
        .instance()
        .setTags(
          GetSentryTags.basic(
            500,
            'FallbackExceptionFilter',
            request.url,
            request.method,
          ),
        );

      client
        .instance()
        .captureException(
          exception.message ? exception.message : 'Unexpected error ocurred',
        );
    }
    return response.status(500).json({
      statusCode: 500,
      createdBy: 'FallbackExceptionFilter',
      stack: exception.stack,
      message: exception.message
        ? 'FallbackExceptionFilter : ' + exception.message
        : 'Unexpected error ocurred',
    });
  }
}

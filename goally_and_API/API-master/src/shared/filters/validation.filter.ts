import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    // //get data required for sentry
    // const request = ctx.getRequest();
    // const user: User = request.user;
    // const device: Device = request.device;
    // const client = new SentryService();

    // if (user) client.instance().setTags(GetSentryTags.user(user));
    // if (device) client.instance().setTags(GetSentryTags.device(device));
    // client
    //   .instance()
    //   .setTags(
    //     GetSentryTags.basic(
    //       400,
    //       'ValidationFilter',
    //       request.url,
    //       request.method,
    //     ),
    //   );

    // client.instance().captureException(exception.errors);

    return response.status(400).json({
      statusCode: 400,
      createdBy: 'ValidationFilter',
      message: exception.errors,
    });
  }
}

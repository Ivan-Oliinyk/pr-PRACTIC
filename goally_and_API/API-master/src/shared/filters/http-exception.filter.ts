import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // //get data required for sentry
    // const requestDetails = ctx.getRequest();
    // const user: User = requestDetails.user;
    // const device: Device = requestDetails.device;
    // const client = new SentryService();

    // if (user) client.instance().setTags(GetSentryTags.user(user));
    // if (device) client.instance().setTags(GetSentryTags.device(device));
    // client
    //   .instance()
    //   .setTags(
    //     GetSentryTags.basic(
    //       status,
    //       'HttpExceptionFilter',
    //       request.url,
    //       request.method,
    //     ),
    //   );

    // client.instance().captureException(exception.message);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      createdBy: 'HttpExceptionFilter',
      path: request.url,
      message: exception.message,
    });
  }
}

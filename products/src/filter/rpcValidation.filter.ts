import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class RpcValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcValidationFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const eventPattern = host
      .switchToRpc()
      .getContext<RmqContext>()
      .getPattern();
    this.logger.warn(`Invalid payload for '${eventPattern}' event`);
    this.logger.warn(exception.getResponse()['message']);
    return new RpcException(exception.getResponse());
  }
}

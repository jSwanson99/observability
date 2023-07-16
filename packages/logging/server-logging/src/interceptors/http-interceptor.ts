import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger: Logger = new Logger(HttpLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        const { originalUrl, method, params, query, body } = req;

        this.logger.log({ message: {
            originalUrl,
            method,
            params,
            query,
            body,
        }});

        return next.handle().pipe(
            tap((res) =>
                this.logger.log({ message: {
                    statusCode,
                    res,
                }}),
            ),
        );
    }
}

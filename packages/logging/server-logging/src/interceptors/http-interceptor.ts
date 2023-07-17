import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { tap } from 'rxjs';
import { round } from 'lodash';
import { getStore } from '../middleware';

const acceptedHeaders = [
    'host',
    'user-agent'
]

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger: Logger = new Logger(HttpLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const { originalUrl, method, params, query, body, headers } = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        const startTime = performance.now();

        const diagnosticHeaders = Object.entries(headers as Record<string, string>).reduce(
            (acc, [key, value]) => {
                if (
                    /^[xX]/.test(key) 
                    || acceptedHeaders.includes(key)
                ) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        this.logger.log({
            message: {
                originalUrl,
                method,
                params,
                query,
                body,
                headers: diagnosticHeaders,
                con222text: getStore(),
            },
        });

        return next.handle().pipe(
            tap((res) =>
                this.logger.log({
                    message: {
                        statusCode,
                        res,
                        durationMillis: round(performance.now() - startTime, 2),
                    },
                }),
            ),
        );
    }
}

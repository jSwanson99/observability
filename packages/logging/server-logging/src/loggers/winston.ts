import {
    WinstonModule,
    WinstonModuleOptions,
    WINSTON_MODULE_NEST_PROVIDER as _WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import * as winston from 'winston';
import opentelemetry, { isSpanContextValid } from '@opentelemetry/api';

const otelFormat = () => {
    return winston.format.printf((data: winston.Logform.TransformableInfo) => {
        const activeSpan = opentelemetry.trace.getActiveSpan();
        if (!activeSpan) {
            return JSON.stringify(data, null, 4);
        }
        const spanCtx = activeSpan.spanContext();
        if (!isSpanContextValid(spanCtx)) {
            return JSON.stringify(data, null, 4);
        }
        const { traceId, spanId } = spanCtx;
        return JSON.stringify(
            {
                ...data,
                metadata: {
                    traceId,
                    spanId,
                },
            },
            null,
            4,
        );
    });
};

export const WINSTON_DEFAULTS = {
    format: winston.format.combine(
        winston.format.timestamp(), 
        winston.format.prettyPrint(), 
        otelFormat()
    ),
    transports: [new winston.transports.Console()],
};

export const getWinstonModule: (
    loggerOptions: Partial<WinstonModuleOptions>,
) => ReturnType<typeof WinstonModule.forRoot> = (loggerOptions = WINSTON_DEFAULTS) => {
    return WinstonModule.forRoot(loggerOptions);
};

export const getWinstonLogger: (
    loggerOptions?: Partial<WinstonModuleOptions>,
) => ReturnType<typeof WinstonModule.createLogger> = (loggerOptions = WINSTON_DEFAULTS) => {
    return WinstonModule.createLogger(loggerOptions);
};

export const WINSTON_MODULE_NEST_PROVIDER = _WINSTON_MODULE_NEST_PROVIDER;

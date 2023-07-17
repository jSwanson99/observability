import {
    WinstonModule,
    WinstonModuleOptions,
    WINSTON_MODULE_NEST_PROVIDER as _WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import opentelemetry, { isSpanContextValid } from '@opentelemetry/api';
import { compact, flow } from 'lodash';
import * as winston from 'winston';

interface WinstonConfig {
    addOtelData: boolean;
    prettyPrint: boolean;
    colorize: boolean;
}

const addOtelData = (data: winston.Logform.TransformableInfo) => {
    const activeSpan = opentelemetry.trace.getActiveSpan();
    if (!activeSpan) {
        return data;
    }
    const spanCtx = activeSpan.spanContext();
    if (!isSpanContextValid(spanCtx)) {
        return data;
    }
    const { traceId, spanId } = spanCtx;
    return {
        ...data,
        metadata: {
            traceId,
            spanId,
        },
    };
};

const colorize = (data: winston.Logform.TransformableInfo) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
        return acc;
    }, data);
};

const otelFormat = () => {
    return winston.format.printf((data: winston.Logform.TransformableInfo) => {
        const logPayload = flow(compact([
            addOtelData,
            colorize
        ]))(data);

        return JSON.stringify(logPayload, null, 4)
    });
};

export const WINSTON_DEFAULTS = {
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint(), otelFormat()),
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

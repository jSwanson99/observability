import { WinstonModule, WinstonModuleOptions, WINSTON_MODULE_NEST_PROVIDER as _WINSTON_MODULE_NEST_PROVIDER} from "nest-winston"
import * as winston from 'winston';
import opentelemetry, { isSpanContextValid } from '@opentelemetry/api';


export const WINSTON_OPTIONS: Partial<WinstonModuleOptions> = {
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((data: winston.Logform.TransformableInfo) => {
            const activeSpan = opentelemetry.trace.getActiveSpan();
            if(!activeSpan) {
                return JSON.stringify(data, null, 4); 
            }
            const spanCtx = activeSpan.spanContext();
            if(!isSpanContextValid(spanCtx)) {
                return JSON.stringify(data, null, 4);
            }
            const { traceId, spanId } = spanCtx;
            return JSON.stringify({
                ...data,
                message: {
                    ...data.message,
                    traceId, 
                    spanId
                }
            }, null, 4);
        }),
    ),
    transports: [
        new winston.transports.Console()
    ],
}

export const getWinstonModule: () => ReturnType<typeof WinstonModule.forRoot> = () => {
    return WinstonModule.forRoot(WINSTON_OPTIONS);
}

export const getWinstonLogger: () => ReturnType<typeof WinstonModule.createLogger> = () => {
    return WinstonModule.createLogger(WINSTON_OPTIONS);
}

export const WINSTON_MODULE_NEST_PROVIDER = _WINSTON_MODULE_NEST_PROVIDER;
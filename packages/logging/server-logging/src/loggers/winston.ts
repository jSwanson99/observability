import { WinstonModule, WinstonModuleOptions, WINSTON_MODULE_NEST_PROVIDER as _WINSTON_MODULE_NEST_PROVIDER} from "nest-winston"
import * as winston from 'winston';

export const WINSTON_OPTIONS: Partial<WinstonModuleOptions> = {
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
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
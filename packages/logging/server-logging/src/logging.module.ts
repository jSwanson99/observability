import { DynamicModule, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { WinstonModuleOptions } from "nest-winston";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ALS_CONTEXT, alsContextMiddleware, getStore } from "./middleware/request-context";
import { HttpLoggingInterceptor } from "./interceptors";
import { getWinstonModule } from "./loggers";

@Module({ })
export class LoggingModule implements NestModule {
    static register(loggerOptions?: WinstonModuleOptions) : DynamicModule {
        return {
            module: LoggingModule,
            providers: [
                {
                    provide: APP_INTERCEPTOR,
                    useClass: HttpLoggingInterceptor,
                },
                {
                    provide: ALS_CONTEXT,
                    useFactory: getStore
                }
            ],
            exports: [
                {
                    provide: ALS_CONTEXT,
                    useFactory: getStore
                }
            ],
            imports: [
                getWinstonModule(loggerOptions)
            ],
            controllers: [],
            global: true
        }
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(alsContextMiddleware)
            .forRoutes('*')
    }
}
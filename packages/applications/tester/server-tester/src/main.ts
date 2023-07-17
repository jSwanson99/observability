import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor, getWinstonLogger } from 'server-logging';
import { otelSDK } from 'server-instrumentation';

async function bootstrap() {
    otelSDK.start();
    const app = await NestFactory.create(AppModule, {
        logger: getWinstonLogger(),
    });

    await app.listen(8080);
}
bootstrap();

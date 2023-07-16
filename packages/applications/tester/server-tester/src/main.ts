import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getWinstonLogger } from 'server-logging';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: getWinstonLogger(),
    });

    await app.listen(8080);
}
bootstrap();

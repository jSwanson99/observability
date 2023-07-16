import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getWinstonModule } from 'server-logging';

@Module({
  imports: [
    getWinstonModule()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

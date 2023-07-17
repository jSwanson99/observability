import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from 'server-logging';

@Module({
  imports: [
    LoggingModule.register()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

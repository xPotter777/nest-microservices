import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OperationsService } from './operations.service';
import { OperationsCancellationService } from './operations-cancelation.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [OperationsService, OperationsCancellationService],
})
export class AppModule {}

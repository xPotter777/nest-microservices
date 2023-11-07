import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const rabbitMQUrls = configService.get(
    'RABBITMQ_URL',
    'amqp://localhost:5672',
  );
  const rabbitMQQueue = configService.get('RABBITMQ_QUEUE', 'operations_queue');
  const app = await NestFactory.createMicroservice<RmqOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrls],
      queue: rabbitMQQueue,
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}

bootstrap();

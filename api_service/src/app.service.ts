import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendOperationDto } from './dto/send-operation.dto';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendSync({
    operationId,
    message,
  }: { operationId: string } & SendOperationDto): Promise<any> {
    return this.client
      .send('operations.sync', { id: operationId, message })
      .toPromise();
  }

  async sendAsync({
    operationId,
    message,
  }: { operationId: string } & SendOperationDto): Promise<any> {
    this.client.emit('operations.async', { id: operationId, message });
    return { message: 'Operation dispatched!' };
  }

  async sendTerminate(): Promise<any> {
    this.client.emit('operations.terminate', { message: 'Terminate all.' });
    return { message: 'Terminate signal sent!' };
  }
}

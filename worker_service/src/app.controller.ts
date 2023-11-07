import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { OperationsService } from './operations.service';
import { OperationsCancellationService } from './operations-cancelation.service';

@Controller()
export class AppController {
  constructor(
    private readonly operationsService: OperationsService,
    private readonly operationsCancellationService: OperationsCancellationService,
  ) {}

  @MessagePattern('operations.sync')
  async handleSyncOperation(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.processOperation(data);

    channel.ack(originalMsg);

    return { status: 'Completed', operationId: data.id };
  }

  @MessagePattern('operations.async')
  async handleAsyncOperation(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.processOperation(data);

    await this.operationsService.setOperationStatus(data.id, 'Completed');

    channel.ack(originalMsg);
  }

  @EventPattern('operations.terminate')
  async handleTerminate(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Processing operation terminate');
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.operationsCancellationService.cancelAllOperations();

    channel.ack(originalMsg);
  }

  private async processOperation(data: any) {
    console.log('Processing operation:', data.message);
    const cancellationToken = this.operationsCancellationService.createToken(
      data.id,
    );

    try {
      await new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          try {
            cancellationToken.throwIfCancelled();
          } catch (error) {
            clearInterval(checkInterval);
            reject(error);
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(checkInterval);
          resolve('Done');
        }, 5000);
      });
    } catch (error) {
      console.log('ERROR', error.message);
      if (error.message === 'Operation cancelled') {
        console.log(`Operation ${data.id} was cancelled.`);
        return;
      }
    }

    console.log('Operation processed:', data.message);
  }
}

import { Injectable } from '@nestjs/common';
import { default as Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OperationService {
  private redisClient: Redis;
  private operationHashKey = this.configService.get(
    'REDIS_OPERATIONS_HASH',
    'operations_statuses',
  );

  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get('REDIS_HOST', '127.0.0.1');
    const redisPort = this.configService.get('REDIS_PORT', 6379);

    this.redisClient = new Redis({
      port: redisPort,
      host: redisHost,
    });
  }

  async setOperationStatus(id: string, status: string): Promise<void> {
    await this.redisClient.hset(this.operationHashKey, id, status);
  }

  async getOperationStatus(id: string): Promise<string | null> {
    return await this.redisClient.hget(this.operationHashKey, id);
  }

  async clearAllStatuses(): Promise<void> {
    await this.redisClient.del(this.operationHashKey);
  }

  async terminateOperations(): Promise<void> {
    await this.redisClient.del(this.operationHashKey);
  }
}

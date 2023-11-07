import { Injectable } from '@nestjs/common';
import { CancellationToken } from './instances/cancelation-token.instance';

@Injectable()
export class OperationsCancellationService {
  private tokens = new Map<string, CancellationToken>();

  createToken(operationId: string): CancellationToken {
    const token = new CancellationToken();
    this.tokens.set(operationId, token);
    return token;
  }

  cancelOperation(operationId: string) {
    const token = this.tokens.get(operationId);
    if (token) {
      token.cancel();
      this.tokens.delete(operationId);
    }
  }

  cancelAllOperations() {
    for (const [operationId, token] of this.tokens.entries()) {
      token.cancel();
      this.tokens.delete(operationId);
    }
  }
}

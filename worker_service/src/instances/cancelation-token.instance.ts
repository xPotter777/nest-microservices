export class CancellationToken {
  private isCancelled = false;

  cancel() {
    this.isCancelled = true;
  }

  throwIfCancelled() {
    if (this.isCancelled) {
      throw new Error('Operation cancelled');
    }
  }
}

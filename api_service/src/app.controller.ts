import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOperationDto } from './dto/send-operation.dto';
import { ProducerService } from './app.service';
import { v4 } from 'uuid';
import { OperationService } from './operations.service';
import { GetOperationStatusDto } from './dto/operation-status.dto';

@Controller('api')
@ApiTags('operations')
export class AppController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly operationsService: OperationService,
  ) {}

  @Post('operations/async')
  @ApiOperation({ summary: 'Send operation async' })
  @ApiResponse({ status: 200, description: 'Operation accepted.' })
  async sendOperationAsync(@Body() sendOperationDto: SendOperationDto) {
    const operationId = v4();
    await this.operationsService.setOperationStatus(operationId, 'pending');
    this.producerService.sendAsync({ operationId, ...sendOperationDto });
    return { operationId };
  }

  @Post('operations/sync')
  @ApiOperation({ summary: 'Send operation sync' })
  @ApiResponse({ status: 200, description: 'Operation accepted.' })
  async sendOperationSync(@Body() sendOperationDto: SendOperationDto) {
    const operationId = v4();
    await this.operationsService.setOperationStatus(operationId, 'pending');
    return this.producerService.sendSync({ operationId, ...sendOperationDto });
  }

  @Get('operations/status')
  @ApiOperation({ summary: 'Get operation status by id' })
  @ApiResponse({ status: 200, description: 'Operation status retrieved.' })
  async getOperationStatus(@Query() { id }: GetOperationStatusDto) {
    const status = await this.operationsService.getOperationStatus(id);
    return { id, status };
  }

  @Delete('operations/clear')
  @ApiOperation({ summary: 'Clear all operations statuses' })
  @ApiResponse({ status: 200, description: 'All statuses cleared.' })
  async clearStoredStatuses() {
    await this.operationsService.clearAllStatuses();
    return { message: 'All stored statuses have been cleared.' };
  }

  @Post('operations/terminate')
  @ApiOperation({
    summary: 'Clear all operations statuses and terminate current operations',
  })
  @ApiResponse({
    status: 200,
    description: 'All statuses cleared and all operations terminated.',
  })
  async terminateAllOperations() {
    await this.operationsService.terminateOperations();
    return this.producerService.sendTerminate();
  }
}

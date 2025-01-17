import { Controller, Post, Get, Body, HttpException, Query } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    @Post('trigger')
    async triggerIngestion(@Body() body: { source: string }) {
        if (!body.source) {
            throw new HttpException('Source is required', 400);
        }
        return this.ingestionService.triggerIngestionProcess(body.source);
    }

    @Get('status')
    async getIngestionStatus(@Query('processId') processId: string) {
        return this.ingestionService.getIngestionStatus(processId);
    }

}

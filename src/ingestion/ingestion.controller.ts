import { Controller, Post, Get, Body, HttpException } from '@nestjs/common';
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
}

import { Controller, Post, Get, Body, HttpException, Query, UseGuards, Logger } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
@Controller('ingestion')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IngestionController {
    private readonly logger = new Logger(IngestionController.name);

    constructor(private readonly ingestionService: IngestionService) { }

    @Post('trigger')
    async triggerIngestion(@Body() body: { source: string }) {
        if (!body.source) {
            throw new HttpException('Source is required', 400);
        }
        this.logger.log(`Triggering ingestion for source: ${body.source}`);
        return this.ingestionService.triggerIngestionProcess(body.source);
    }

    @Get('status')
    @Roles('admin', 'editor', 'viewer')
    async getIngestionStatus(@Query('processId') processId: string) {
        if (!processId) {
            throw new HttpException('Process ID is required', 400);
        }
        this.logger.log(`Fetching ingestion status for processId: ${processId}`);
        return this.ingestionService.getIngestionStatus(processId);
    }

}

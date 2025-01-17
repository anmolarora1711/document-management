import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
    constructor(private readonly httpService: HttpService) { }

    async triggerIngestionProcess(source: string): Promise<any> {
        const pythonBackendUrl = 'http://python-backend/ingest'; // Replace with actual URL
        try {
            const response = await lastValueFrom(this.httpService.post(pythonBackendUrl, { source }));
            return response.data;
        } catch (error) {
            throw new HttpException(`Ingestion trigger failed: ${error.message}`, error.response?.status || 500);
        }
    }
}

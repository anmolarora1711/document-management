import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

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

    async getIngestionStatus(processId: string): Promise<any> {
        const pythonBackendUrl = `http://python-backend/ingestion-status/${processId}`;
        try {
            const response: AxiosResponse = await lastValueFrom(this.httpService.get(pythonBackendUrl));
            return response.data;
        } catch (error) {
            throw new HttpException(`Failed to fetch ingestion status: ${error.message}`, error.response?.status || 500);
        }
    }
}

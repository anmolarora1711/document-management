import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { HttpException } from '@nestjs/common';

describe('IngestionController', () => {
    let ingestionController: IngestionController;
    let ingestionService: IngestionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IngestionController],
            providers: [
                {
                    provide: IngestionService,
                    useValue: {
                        triggerIngestionProcess: jest.fn().mockResolvedValue({ message: 'Ingestion triggered successfully' }),
                        getIngestionStatus: jest.fn().mockResolvedValue({ status: 'InProgress' }),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({})
            .overrideGuard(RolesGuard)
            .useValue({})
            .compile();

        ingestionController = module.get<IngestionController>(IngestionController);
        ingestionService = module.get<IngestionService>(IngestionService);
    });

    describe('triggerIngestion', () => {
        it('should trigger ingestion process successfully', async () => {
            const result = { message: 'Ingestion triggered successfully' };
            await expect(ingestionController.triggerIngestion({ source: 'test-source' })).resolves.toEqual(result);
            expect(ingestionService.triggerIngestionProcess).toHaveBeenCalledWith('test-source');
        });

        it('should throw an error if source is not provided', async () => {
            await expect(ingestionController.triggerIngestion({ source: '' })).rejects.toThrow('Source is required');
        });
    });

    describe('getIngestionStatus', () => {
        it('should return ingestion status', async () => {
            const result = { status: 'InProgress' };
            await expect(ingestionController.getIngestionStatus('12345')).resolves.toEqual(result);
            expect(ingestionService.getIngestionStatus).toHaveBeenCalledWith('12345');
        });

        it('should throw an error if processId is not provided', async () => {
            await expect(ingestionController.getIngestionStatus('')).rejects.toThrow('Process ID is required');
        });
    });
});

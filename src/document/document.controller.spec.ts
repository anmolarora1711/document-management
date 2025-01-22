import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Document } from '../database/entities/document.entity';
import { StreamableFile, ForbiddenException } from '@nestjs/common';

describe('DocumentController', () => {
    let documentController: DocumentController;
    let documentService: DocumentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentController],
            providers: [
                {
                    provide: DocumentService,
                    useValue: {
                        createDocument: jest.fn().mockResolvedValue({ id: 1, title: 'Test Document', description: 'Description', authorId: 1 }),
                        uploadFile: jest.fn().mockResolvedValue({ id: 1, filePath: 'path/to/file' }),
                        getDocument: jest.fn().mockResolvedValue({ id: 1, title: 'Test Document' }),
                        findAllDocuments: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Document' }]),
                        updateDocumentMetadata: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Title' }),
                        deleteDocument: jest.fn().mockResolvedValue(undefined),
                        downloadDocument: jest.fn().mockResolvedValue(new StreamableFile(Buffer.from('File content'))),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({})
            .overrideGuard(RolesGuard)
            .useValue({})
            .compile();

        documentController = module.get<DocumentController>(DocumentController);
        documentService = module.get<DocumentService>(DocumentService);
    });

    describe('createDocument', () => {
        it('should create a new document', async () => {
            const result = { id: 1, title: 'Test Document', description: 'Description', authorId: 1 };
            await expect(documentController.createDocument({ title: 'Test Document', description: 'Description', authorId: 1 })).resolves.toEqual(result);
            expect(documentService.createDocument).toHaveBeenCalledWith('Test Document', 'Description', 1);
        });
    });

    describe('uploadDocument', () => {
        it('should upload a document file', async () => {
            const result = { id: 1, filePath: 'path/to/file' };
            const mockFile = { path: 'path/to/file' } as Express.Multer.File;
            await expect(documentController.uploadDocument(1, mockFile)).resolves.toEqual(result);
            expect(documentService.uploadFile).toHaveBeenCalledWith(1, 'path/to/file');
        });

        it('should throw an error if no file is uploaded', async () => {
            await expect(documentController.uploadDocument(1, undefined as any)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('getDocument', () => {
        it('should return document metadata', async () => {
            const result = { id: 1, title: 'Test Document' };
            await expect(documentController.getDocument(1)).resolves.toEqual(result);
            expect(documentService.getDocument).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllDocuments', () => {
        it('should return a list of documents', async () => {
            const result = [{ id: 1, title: 'Test Document' }];
            await expect(documentController.getAllDocuments()).resolves.toEqual(result);
            expect(documentService.findAllDocuments).toHaveBeenCalled();
        });
    });

    describe('updateDocumentMetadata', () => {
        it('should update document metadata', async () => {
            const result = { id: 1, title: 'Updated Title' };
            await expect(documentController.updateDocumentMetadata(1, { title: 'Updated Title' })).resolves.toEqual(result);
            expect(documentService.updateDocumentMetadata).toHaveBeenCalledWith(1, { title: 'Updated Title' });
        });
    });

    describe('deleteDocument', () => {
        it('should delete a document', async () => {
            await expect(documentController.deleteDocument(1)).resolves.toBeUndefined();
            expect(documentService.deleteDocument).toHaveBeenCalledWith(1);
        });
    });

});

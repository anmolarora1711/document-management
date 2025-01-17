import { Controller, Post, Body, Param, Get, Put, Delete, Query, UploadedFile, StreamableFile, UseInterceptors, UseGuards, ForbiddenException } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Document } from '../database/entities/document.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    // Create new document
    @Post('create')
    @Roles('admin', 'editor')
    async createDocument(@Body() body: { title: string; description: string; authorId: number }) {
        console.log(body);
        return this.documentService.createDocument(body.title, body.description, body.authorId);
    }

    // Upload document
    @Post('upload/:id')
    @Roles('admin', 'editor')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = `${Date.now()}${extname(file.originalname)}`;
                callback(null, `${file.fieldname}-${uniqueSuffix}`);
            },
        }),
    }))
    async uploadDocument(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new ForbiddenException('No file uploaded');
        }
        console.log(file);
        return this.documentService.uploadFile(id, file.path);
    }

    // Get document metadata
    @Get(':id')
    @Roles('admin', 'editor', 'viewer')
    async getDocument(@Param('id') id: number) {
        return this.documentService.getDocument(id);
    }

    // List all documents
    @Get()
    @Roles('admin', 'editor', 'viewer')
    async getAllDocuments(@Query('title') title?: string): Promise<Document[]> {
        return this.documentService.findAllDocuments(title);
    }

    // Update document metadata
    @Put(':id')
    @Roles('admin', 'editor')
    async updateDocumentMetadata(@Param('id') id: number, @Body() body: { title?: string; description?: string }): Promise<Document> {
        return this.documentService.updateDocumentMetadata(id, body);
    }

    // Delete document
    @Delete(':id')
    @Roles('admin')
    async deleteDocument(@Param('id') id: number): Promise<void> {
        return this.documentService.deleteDocument(id);
    }

    // Download document
    @Get('download/:id')
    @Roles('admin', 'editor', 'viewer')
    async downloadDocument(@Param('id') id: number): Promise<StreamableFile> {
        return this.documentService.downloadDocument(id);
    }
}
import { Controller, Post, Body, Param, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('create')
    async createDocument(@Body() body: { title: string; description: string; authorId: number }) {
        console.log(body);
        return this.documentService.createDocument(body.title, body.description, body.authorId);
    }

    @Post('upload/:id')
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
            throw new Error('No file uploaded');
        }
        console.log(file);
        return this.documentService.uploadFile(id, file.path);
    }

    @Get(':id')
    async getDocument(@Param('id') id: number) {
        return this.documentService.getDocument(id);
    }
}

import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../database/entities/document.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
    ) { }

    async createDocument(title: string, description: string, authorId: number): Promise<Document> {
        const newDocument = this.documentRepository.create({ title, description, authorId });
        return this.documentRepository.save(newDocument);
    }

    async uploadFile(documentId: number, filePath: string): Promise<Document> {
        const document = await this.documentRepository.findOne({ where: { id: documentId } });
        if (!document) {
            throw new NotFoundException('Document not found');
        }
        document.filePath = filePath;
        return this.documentRepository.save(document);
    }

    async getDocument(documentId: number): Promise<Document> {
        const document = await this.documentRepository.findOne({ where: { id: documentId } });
        if (!document) {
            throw new NotFoundException('Document not found');
        }
        return document;
    }

    async findAllDocuments(title?: string): Promise<Document[]> {
        const queryBuilder = this.documentRepository.createQueryBuilder('document');
        if (title) {
            queryBuilder.where('document.title LIKE :title', { title: `%${title}%` });
        }
        return queryBuilder.getMany();
    }

    async updateDocumentMetadata(id: number, metadata: { title?: string; description?: string }): Promise<Document> {
        const document = await this.documentRepository.findOne({ where: { id: id } });
        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        if (metadata.title) {
            document.title = metadata.title;
        }
        if (metadata.description) {
            document.description = metadata.description;
        }
        return this.documentRepository.save(document);
    }

    async deleteDocument(id: number): Promise<void> {
        const document = await this.documentRepository.findOne({ where: { id: id } });
        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        await this.documentRepository.remove(document);
    }

    async downloadDocument(id: number): Promise<StreamableFile> {
        const document = await this.documentRepository.findOne({ where: { id: id } });
        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        const filePath = join(__dirname, '..', '..', 'uploads', document.filePath);
        try {
            const fileStream = createReadStream(filePath);
            return new StreamableFile(fileStream);
        } catch (error) {
            throw new NotFoundException(`Document file not found`);
        }
    }
}

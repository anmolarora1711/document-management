import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../database/entities/document.entity';
import * as fs from 'fs';
import * as path from 'path';

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
}

import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { IngestionService } from './ingestion';

@Module({
  controllers: [RagController],
  providers: [RagService, IngestionService],
})
export class RagModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RagModule } from './rag/rag.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [RagModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

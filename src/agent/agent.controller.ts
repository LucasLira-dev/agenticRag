import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('ask')
  async ask(@Body('question') question: string) {
    return this.agentService.ask(question);
  }
}

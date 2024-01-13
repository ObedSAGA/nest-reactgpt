import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  })

  // Solo va a llamar caso de uso
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt
    });
  }
}

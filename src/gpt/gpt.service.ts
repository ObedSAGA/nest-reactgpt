import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, translateUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import { ProsConsDiscusserDto, TranslateDto } from './dtos';

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
  
  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt
    })
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt
    })
  }

  async translate(translateDto: TranslateDto){
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang
    })
  }
}

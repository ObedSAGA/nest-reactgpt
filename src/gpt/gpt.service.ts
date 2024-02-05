import * as path from "path";
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';

import OpenAI from 'openai';

import { imageGenerationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import { AudioToTextDto, ImageGenerationDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { audioToTextUseCase } from "./use-cases/audio-to-text-use-case";

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


  async textToAudio(textToAudioDto: TextToAudioDto){
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudioDto.prompt,
      voice: textToAudioDto.voice
    })
  }

  async textToAudioGetter(fileId: String) {
    const filePath = path.resolve(__dirname, `../../generated/audios/${fileId}.mp3`);
    const wasFound = fs.existsSync(filePath);

    if(!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
    const {prompt} = audioToTextDto

    return await audioToTextUseCase(this.openai, {audioFile, prompt})
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto){
    return await imageGenerationUseCase(this.openai, {...imageGenerationDto})
  }

  async getGeneratedImage(fileName: String) {
    const filePath = path.resolve(__dirname, `../../generated/images/${fileName}`);
    const wasFound = fs.existsSync(filePath);

    if(!wasFound) throw new NotFoundException(`File ${fileName} not found`);

    return filePath;
  }

}

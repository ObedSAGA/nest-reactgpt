import * as fs from 'fs';

import OpenAI from "openai";

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;

}

export const audioToTextUseCase = async (openei: OpenAI, options: Options) => {
    const {prompt, audioFile} = options;
    console.log({prompt, audioFile});

    const response = await openei.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path),
        prompt: prompt, //mismo idioma del audio.
        language: 'es',
        response_format: 'verbose_json', // puede ser vtt, srt o verbose_json
    });

    console.log(response);

    return response;
    
}
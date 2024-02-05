import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async(openai: OpenAI, options: Options) => {
    const {prompt, maskImage, originalImage} = options;

    //todo: verificar original image
    
    const response = await openai.images.generate({
        prompt: prompt,
        model: 'dall-e-3',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    });

    //Guarda imagen en file system
    await downloadImageAsPng(response.data[0].url);

    console.log(response);

    return{
        url: response.data[0].url,
        localPath: '',
        revise_prompt: response.data[0].revised_prompt,
    }
    
}
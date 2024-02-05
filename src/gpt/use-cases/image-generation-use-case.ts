import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';
import path from "path";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async(openai: OpenAI, options: Options) => {
    const {prompt, maskImage, originalImage} = options;

    //Verify original image and mask image to edit image
    if (!maskImage && !originalImage) {
        
        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });
    
        //Save image en file system as PNG
        const fileName = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`
        return{
            url: url,
            openIaUrl: response.data[0].url,
            revise_prompt: response.data[0].revised_prompt,
        }
    }
    
    const pngImagePath = await downloadImageAsPng(originalImage);
    const maskPath = await downloadBase64ImageAsPng(maskImage);


    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    })

    
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`
    return{
        url: url, 
        openIaUrl: response.data[0].url,
        revise_prompt: response.data[0].revised_prompt,
    }
}
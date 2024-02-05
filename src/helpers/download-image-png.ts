import { InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import * as sharp from 'sharp';


export const downloadImageAsPng = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new InternalServerErrorException('Download image was not posible')
    }

    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, {recursive: true});

    const imageNamePng = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer())
    const completePath = path.join(folderPath, imageNamePng)
    // fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

    await sharp(buffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);


    return completePath;
}
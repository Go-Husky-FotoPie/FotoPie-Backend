import {
  Controller,
  Post,
  Body,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateImageService } from "./create-image.service";
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response, Express } from "express";
import * as multer from "multer";
import * as sharp from "sharp";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Create Image")
@Controller("create-image")
export class CreateImageController {
  constructor(private createImageService: CreateImageService) {}

  @Post("new-image")
  @HttpCode(HttpStatus.OK)
  async createImage(@Body() body: { prompt: string }): Promise<object> {
    return this.createImageService.createNewImage(body.prompt);
  }

  @Post("/image-variation")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.memoryStorage(),
    })
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 4 * 1024 * 1024 }), // 4MB
          new FileTypeValidator({ fileType: "image" }),
        ], // 10MB
      })
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // set file name
    const fileName = `user-${uuidv4()}.png`;

    // resize image
    const fileBuffer = await sharp(file.buffer)
      .resize(512, 512)
      .toFormat("png")
      .toColourspace("rgb16")
      .png({ quality: 10 })
      .toBuffer();

    const urls = await this.createImageService.createImageVariation(fileBuffer);
    return res.status(HttpStatus.OK).json({ urls });
  }
}

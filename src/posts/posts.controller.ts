import { ConfigService } from "@nestjs/config";
import { HttpStatus } from "@nestjs/common/enums";
import { Posts } from "./schema/post.schema";
import { PostsService } from "./posts.service";
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
} from "@nestjs/common";
import { Req, Res } from "@nestjs/common";
import { PostDTO } from "./dto/post.dto";
import * as multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import * as sharp from "sharp";
import { Query as ExpressQuery } from "express-serve-static-core";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(
    private readonly PostsService: PostsService,
    private ConfigService: ConfigService
  ) {}

  @Patch("upload")
  @UseInterceptors(FileInterceptor("file", { storage: multer.memoryStorage() }))
  async upload(@UploadedFile() file, @Res() res, @Req() req) {
    const filename = `${uuidv4()}.jpeg`;

    const fileBuffer = await sharp(file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 30 })
      .toBuffer();

    // S3 upload
    const s3Clinet = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: this.ConfigService.get("aws_access_key_id"),
        secretAccessKey: this.ConfigService.get("aws_access_key_secret"),
      },
    });

    await s3Clinet.send(
      new PutObjectCommand({
        Bucket: "fotopie-photo",
        Body: file.buffer,
        Key: filename,
        ContentType: file.mimetype,
      })
    );

    await s3Clinet.send(
      new PutObjectCommand({
        Bucket: "fotopie-photo-compression",
        Body: fileBuffer,
        Key: filename,
        ContentType: "image/jpeg",
      })
    );

    return res.status(HttpStatus.OK).json({
      message: "Confirmed ",
      filename: filename,
      original_path: `https://fotopie-photo.s3.ap-southeast-2.amazonaws.com/${filename}`,
      compression_path: `https://fotopie-photo-compression.s3.ap-southeast-2.amazonaws.com/${filename}`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("sent")
  async create(@Body() PostDTO: PostDTO, @Req() req: any) {
    const posts = new Posts();
    posts.userEmail = req.user["email"];
    posts.filename = PostDTO.filename;
    posts.tag = PostDTO.tag;
    posts.price = PostDTO.price;
    posts.description = PostDTO.description;
    posts.compressFilePath = PostDTO.compressFilePath;
    posts.orginalFilePath = PostDTO.orginalFilePath;

    await this.PostsService.create(posts);
    return posts;
  }
  @Get()
  getAllPosts(@Query() query: ExpressQuery): Promise<PostDTO[]> {
    return this.PostsService.findAllPosts(query);
  }
}

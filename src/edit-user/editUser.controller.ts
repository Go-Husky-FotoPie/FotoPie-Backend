import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response, Express } from "express";
import * as multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as sharp from "sharp";
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { EditUserService } from "./editUser.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { EditUserDto } from "./dto/edit-user.dto";
import { ConfigService } from "@nestjs/config";

@UseGuards(JwtAuthGuard)
@Controller("editUser")
export class EditUserController {
  constructor(
    private editUserService: EditUserService,
    private configService: ConfigService
  ) {}

  // update user name
  @Patch("/updateName")
  async editUser(
    @Req() req: Request,
    @Body() dto: EditUserDto,
    @Res() res: Response
  ) {
    const userEmail = req.user["email"];
    const updatedData = await this.editUserService.updateNameByEmail(
      userEmail,
      dto
    );

    if (!updatedData) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return res.status(HttpStatus.OK).json({
      updatedData,
    });
  }

  // get user info
  @Get("me")
  async me(@Req() req: Request, @Res() res: Response) {
    const userEmail = req.user["email"];
    const user = await this.editUserService.findByEmail(userEmail);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const { firstName, lastName, avatar, avatarPath, _id } = user;

    return res.status(HttpStatus.OK).json({
      firstName,
      lastName,
      avatar,
      avatarPath,
      id: _id,
    });
  }

  // upload avatar
  @Patch("upload")
  // set multer middleware
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.memoryStorage(),
    })
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: "image" }),
        ], // 10MB
      })
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // set file name
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

    // resize image
    const fileBuffer = await sharp(file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 10 })
      .toBuffer();

    // S3 upload
    const s3Clinet = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: this.configService.get("aws_access_key_id"),
        secretAccessKey: this.configService.get("aws_access_key_secret"),
      },
    });

    try {
      await s3Clinet.send(
        new PutObjectCommand({
          Bucket: "fotopie-avatar",
          Body: fileBuffer,
          Key: fileName,
          ContentType: file.mimetype,
        })
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    // get user email from jwt token
    const userEmail = req.user["email"];

    // update avatar in db
    const user = await this.editUserService.updateAvatarByEmail(userEmail, {
      avatar: fileName,
      avatarPath: `https://fotopie-avatar.s3.ap-southeast-2.amazonaws.com/${fileName}`,
    });

    const { avatar, avatarPath } = user;

    if (!user) {
      throw new HttpException("error", HttpStatus.BAD_REQUEST);
    }

    return res.status(HttpStatus.OK).json({
      avatar,
      avatarPath,
    });
  }
}

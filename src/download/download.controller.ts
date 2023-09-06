import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { DownloadService } from "./download.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { UseGuards } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Download")
@Controller("download")
export class DownloadController {
  constructor(private downloadService: DownloadService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(
    @Query("filename") filename: string,
    @Req() req: any
  ): Promise<{ url: string }> {
    const userEmail = req.user["email"];

    const preSignedUrl = await this.downloadService.generatePresignedUrl(
      filename,
      userEmail
    );
    return { url: preSignedUrl };
  }
}

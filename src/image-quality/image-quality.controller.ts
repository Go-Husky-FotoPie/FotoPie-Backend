import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";
import { ImageQualityDto } from "./dto/image-quality.dto";
import { QualityService } from "./image-quality.service";
import { Quality, QualityDocument } from "./schema/image-quality.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { Query } from "@nestjs/common/decorators";
import { Query as ExpressQuery } from "express-serve-static-core";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Image Quality")
@Controller("quality")
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":file")
  @HttpCode(HttpStatus.CREATED)
  async createRank(
    @Param("file") filenameString: string,
    @Query() query: ExpressQuery,
    @Req() req: any
  ) {
    const quality = new Quality();
    quality.user_email = req.user["email"];
    quality.filename = filenameString;
    
    quality.score = String(query.score);
    const users = await this.qualityService.getQualityUserByEmail(
      req.user["email"]
    );
    const user = users[0];
    quality.userName = user?.firstName;
    quality.userAvatar = user?.avatarPath;
    await this.qualityService.create(quality);
    return quality;
  }

  @Get()
  getAllPosts(@Query() query: ExpressQuery): Promise<ImageQualityDto[]> {
    return this.qualityService.findAllQualityPosts(query);
  }
}
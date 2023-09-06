import {
  Controller,
  Post,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";

import { CreateCollectDto } from "./dto/createCollect.dto";
import { CollectService } from "./collect.service";
import { Collect } from "./schemas/collect.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Collect")
@Controller("collect")
export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":filename")
  @HttpCode(HttpStatus.CREATED)
  async getCollect(
    @Param() createCollectDto: CreateCollectDto,
    @Req() req: any
  ) {
    const collect = new Collect();
    collect.collect_user_email = req.user["email"];
    collect.collected_user_email =
      await this.collectService.findEmailByFilename(createCollectDto);
    collect.filename = createCollectDto.filename;
    await this.collectService.checkCollect(collect);
    const collectNumber = await this.collectService.collectNumber(
      createCollectDto
    );
    return { userCollects: collectNumber };
  }
}

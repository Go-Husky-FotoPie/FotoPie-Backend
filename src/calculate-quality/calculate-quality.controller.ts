import { Controller, Get,Body } from "@nestjs/common";
import { CalculateQualityService } from "./calculate-quality.service";
import { Query } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Calculate Quality")
@Controller("everypixel")
export class CalculateQualityController {
  constructor(private readonly calculateQualityService: CalculateQualityService) {}

  @Get()
  async getToken(): Promise<any> {
    const data = await this.calculateQualityService.getToken();
    return data;
  }

  @Get("quality")
  async getQuality(
    @Query("url") url?: string,
    @Body() data?: Record<string, any>
  ): Promise<any> {
    const quality = await this.calculateQualityService.getQuality({ url, data });
    return quality;
  }
}

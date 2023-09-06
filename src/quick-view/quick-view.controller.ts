import {
  Controller,
  Get,
  Headers,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { QuickViewService } from "./quick-view.service";
import { Post_Data } from "./interfaces/quick-view.interface";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Quick View")
@Controller("quick-view")
export class QuickViewController {
  constructor(private quickViewService: QuickViewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPostInfo(
    @Query("filename") filename: string,
    @Headers("Authorization") accessToken: string
  ): Promise<Post_Data> {
    const post_data = await this.quickViewService.getPostData(
      filename,
      accessToken
    );
    return post_data;
  }
}

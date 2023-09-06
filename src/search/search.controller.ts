
import { SearchService } from './search.service'
import { Query } from "@nestjs/common/decorators";
import { Query as ExpressQuery } from "express-serve-static-core";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Search")
@Controller('search')
export class SearchController {
    constructor(private SearchService: SearchService) { }
    
    @Get(":tag")
  async getCategoryPostsData(
    @Param("tag") tag: string,
    @Query() query: ExpressQuery
  ) {
    
    const categoryPosts = await this.SearchService.getSearchPostsIdByTag(
      tag,
      query
    );
    const compressed_s3Url =
      "https://fotopie-photo-compression.s3.ap-southeast-2.amazonaws.com";

    return categoryPosts.map(({ _id, filename, userEmail, price, tag, description }) => {
      return {
        _id,
        compressed_imageUrl: `${compressed_s3Url}/${filename}`,
        userEmail,
        price,
        tag,
        description,
        filename
      };
    });
  }
    
}

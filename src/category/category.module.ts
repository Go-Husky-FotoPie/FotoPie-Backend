import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Posts, PostSchema } from "../posts/schema/post.schema";
import { Category } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
  ],
  providers: [CategoryService],
  controllers: [Category],
})
export class CategoryModule {}

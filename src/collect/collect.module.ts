import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CollectService } from "./collect.service";
import { CollectController } from "./collect.controller";
import { Collect, CollectSchema } from "./schemas/collect.schema";
import { Posts, PostSchema } from "../posts/schema/post.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Collect.name, schema: CollectSchema }]),
  ],
  controllers: [CollectController],
  providers: [CollectService],
  exports: [CollectService],
})
export class CollectModule {}

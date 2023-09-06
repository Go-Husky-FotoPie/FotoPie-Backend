import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Collect, CollectSchema } from "src/collect/schemas/collect.schema";
import { Like, LikeSchema } from "src/like/schemas/like.schema";
import { User, UserSchema } from "../user/schemas/user.schema";
import { Posts, PostSchema } from "../posts/schema/post.schema";
import { UserPost } from "./user-post.controller";
import { UserPostService } from "./user-post.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Collect.name, schema: CollectSchema }]),
    MongooseModule.forFeature([{ name: Collect.name, schema: CollectSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [UserPostService],
  controllers: [UserPost],
})
export class UserPostModule {}

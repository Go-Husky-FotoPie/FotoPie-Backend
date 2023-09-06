import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CreateLikeDto } from "./dto/create-like.dto";
import { UserLikeDto } from "./dto/user-like.dto";
import { Like, LikeDocument } from "./schemas/like.schema";
import { Posts } from "../posts/schema/post.schema";

@Injectable()
export class LikeService {
  constructor(
    @InjectModel("Like") private readonly likeModel: Model<LikeDocument>,
    @InjectModel("Posts") private readonly postModel: Model<Posts>
  ) {}

  async addLike(userLikeDto) {
    const newLike = new this.likeModel(userLikeDto);
    await this.likeModel.create(newLike);
    return;
  }

  async deleteLike(userLikeDto: UserLikeDto) {
    await this.likeModel.deleteOne( userLikeDto );
    return;
  }

  async checkLike({like_user_email, liked_user_email, filename}:Pick<UserLikeDto, 'like_user_email' | 'liked_user_email' | 'filename'>){
    const checkLikeData = await this.likeModel.findOne({like_user_email, liked_user_email, filename});
    if(checkLikeData){
      return this.deleteLike({like_user_email, liked_user_email, filename})
    } else {
      return this.addLike({like_user_email, liked_user_email, filename})
    }
  }

  async numberLike(createLikeDto: CreateLikeDto) {
    return this.likeModel.count(createLikeDto);
  }

  async findEmailByFilename(createLikeDto: CreateLikeDto): Promise<string> {
    const findThePost = await this.postModel.findOne(createLikeDto);
    if (!findThePost) throw new NotFoundException();
    return findThePost.userEmail;
  }
}

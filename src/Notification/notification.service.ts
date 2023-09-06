import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { Posts, PostDocument } from "../posts/schema/post.schema";
import { LikeService } from "src/like/like.service";
import { Like, LikeDocument } from "../like/schemas/like.schema";
import { Req } from "@nestjs/common";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: Model<LikeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Posts.name)
    private postModel: Model<PostDocument>,

    // @InjectModel(Like.name)
    private readonly likeService: LikeService
  ) {}

  async getLatestLikes(@Req() req: any): Promise<Like[]> {
    return this.LikeModel.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async getLikeUsers(like: Like): Promise<User[]> {
    const user = await this.userModel
      .findOne({ email: like.like_user_email }, { avatarPath: 1, firstName: 1 })
      .exec();
    if (!user) {
      return [];
    }
    return [user];
  }

  async getLikePosts(like: Like): Promise<Posts[]> {
    const post = await this.postModel
      .findOne({ filename: like.filename }, { compressFilePath: 1, filename: 1 })
      .exec();
    if (!post) {
      return [];
    }
    return [post];
  }

  async getUnreadCount(currentUserEmail: string): Promise<number> {
    const count = await this.LikeModel.countDocuments({
      liked_user_email: currentUserEmail,
      status: false,
    }).exec();
    // if( !count ) throw new NotFoundException("cannot get new notifications count");
    return count;
  }

  async markAllAsRead(currentUserEmail: string): Promise<boolean> {
    const { acknowledged } = await this.LikeModel.updateMany(
      {
        liked_user_email: currentUserEmail,
        status: false,
      },
      { $set: { status: true } }
    ).exec();
    if (!acknowledged)
      throw new NotFoundException("unable to mark notifications as read");
    return acknowledged;
  }
}

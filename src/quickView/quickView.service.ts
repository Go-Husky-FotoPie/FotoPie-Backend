import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Posts } from "./schema/post.schema";
import { User } from "../user/schemas/user.schema";
import { Collect } from "./schema/collect.schema";
import { Like } from "./schema/like.schema";
import { JwtService as NestJwtService } from "@nestjs/jwt";

@Injectable()
export class QuickViewService {
  constructor(
    @InjectModel("Posts") private readonly postsModel: Model<Posts>,
    @InjectModel("User") private readonly userModel: Model<User>,
    @InjectModel("Like") private readonly likeModel: Model<Like>,
    @InjectModel("Collect") private readonly collectModel: Model<Collect>,
    private readonly nestJwtService: NestJwtService
  ) {}

  async getUsername(filename: string): Promise<string> {
    const post = await this.findPostByFilename(filename);
    const user = await this.findUserByEmail(post.userEmail);
    const user_name = user.firstName + " " + user.lastName;
    return user_name;
  }

  async getUserId(filename: string): Promise<string> {
    const post = await this.findPostByFilename(filename);
    const user = await this.findUserByEmail(post.userEmail);
    const user_id = user._id.toString();
    return user_id;
  }

  async getAvatar(filename: string): Promise<string> {
    const post = await this.findPostByFilename(filename);
    const user = await this.findUserByEmail(post.userEmail);

    const avatar = user.avatar;
    return avatar;
  }

  async getLikes(filename: string): Promise<number> {
    const likes = await this.likeModel.count({ filename });
    return likes;
  }

  async getCollects(filename: string): Promise<number> {
    const collects = await this.collectModel.count({ filename });
    return collects;
  }

  async getLikeStatus(
    filename: string,
    login_user_email: string
  ): Promise<boolean> {
    const status = await this.likeModel.find({
      like_user_email: login_user_email,
      filename: filename,
    });

    // const like_status = status ? true : false;
    // return like_status;
    let like_status = null;
    if (!status) {
      like_status = false;
    } else {
      like_status = true;
    }
    return like_status;
  }

  async getCollectStatus(
    filename: string,
    login_user_email: string
  ): Promise<boolean> {
    const status = await this.collectModel.find({
      like_user_email: login_user_email,
      filename: filename,
    });

    const collect_status = status ? true : false;
    return collect_status;
  }

  async getLoginUserEmail(token: { token: string }): Promise<string> {
    const decodedToken = await this.verifyAsync(token.token);
    const login_user_email = decodedToken.email;
    return login_user_email;
  }

  async findPostByFilename(filename: string): Promise<Posts> {
    const post = await this.postsModel.findOne({ filename });
    if (!post) throw new NotFoundException();
    return post;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  //verify the token
  async verifyAsync(token: string): Promise<{ email: string }> {
    return this.nestJwtService.verifyAsync<{ email: string }>(token);
  }
}
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Injectable,
} from "@nestjs/common";
import { Posts, PostDocument } from "./schema/post.schema";
import { UserService } from "src/user/user.service";
import { Query } from "express-serve-static-core";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postModel: Model<PostDocument>,
    private userService: UserService
  ) {}

  public async create(posts: Posts) {
    const newPosts = new this.postModel(posts);
    return newPosts.save();
  }

  async findAllPosts(query: Query): Promise<PostDocument[]> {
    const resPerPage = Number(query.limit);
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const paginatedImage = this.postModel
      .find()
      .sort({ createdAt: "desc" })
      .limit(resPerPage)
      .skip(skip);

    return paginatedImage;
  }
}

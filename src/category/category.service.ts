import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Posts } from "../posts/schema/post.schema";
import { Query } from "express-serve-static-core";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<Posts>,
  ) {}

  async getCategoryPostsIdByTag(
    tag: string,
    query: Query
  ): Promise<Posts[]> {
    const resPerPage = Number(query.limit);
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const result = this.postModel
      .find(
        { $text: { $search: tag }, tags: { $in: tag.split(" ") } },
        { score: { $meta: "textScore" } }
      )
      .sort({ createdAt: "desc" })
      .limit(resPerPage)
      .sort({ score: { $meta: "textScore" } })
      .skip(skip);
    if (!result) {
      throw new NotFoundException("User collection posts not found");
    }
    return result;
  }
}

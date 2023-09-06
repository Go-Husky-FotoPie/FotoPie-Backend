import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CollectDocument } from "./schemas/collect.schema";
import { Posts } from "../posts/schema/post.schema";
import { CreateCollectDto } from "./dto/create-collect.dto";
import { UserCollectDto } from "./dto/user-collect.dto";

@Injectable()
export class CollectService {
  constructor(
    @InjectModel("Posts") private readonly postModel: Model<Posts>,
    @InjectModel("Collect")
    private readonly collectModel: Model<CollectDocument>
  ) {}

  //find collected user email
  async findEmailByFilename(
    createCollectDto: CreateCollectDto
  ): Promise<string> {
    const post = await this.postModel.findOne(createCollectDto);
    if (!post) throw new NotFoundException();
    return post.userEmail;
  }

  //add a collect
  async addCollect(userCollectDto) {
    const newCollect = new this.collectModel(userCollectDto);
    await this.collectModel.create(newCollect);
    return;
  }

  //delete a collect
  async deleteCollect(userCollectDto: UserCollectDto) {
    await this.collectModel.deleteOne(userCollectDto);
    return;
  }

  async checkCollect(userCollectDto: UserCollectDto) {
    const checkCollectData = await this.collectModel.findOne(userCollectDto);
    if (checkCollectData) {
      return this.deleteCollect(userCollectDto);
    } else {
      return this.addCollect(userCollectDto);
    }
  }

  //get collect number
  async collectNumber(createCollectDto: CreateCollectDto) {
    return await this.collectModel.count(createCollectDto);
  }
}

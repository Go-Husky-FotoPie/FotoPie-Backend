import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

import { User, UserDocument } from "src/user/schemas/user.schema";
import { EditUserDto } from "./dto/edit-user.dto";
import { EditUserAvatarDto } from "./dto/edit-userAvatar.dto";

@Injectable()
export class EditUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  // update user name and surname
  async updateNameByEmail(
    userEmail: string,
    dto: EditUserDto
  ): Promise<{ firstName: string; lastName: string }> {
    const updateUser = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { ...dto },
      { new: true }
    );

    return { firstName: updateUser.firstName, lastName: updateUser.lastName };
  }

  // get user info
  async findByEmail(userEmail: string): Promise<User> {
    const user = await this.userModel.findOne({ email: userEmail }).exec();

    return user;
  }

  // upload avatar
  async updateAvatarByEmail(
    userEmail: string,
    dto: EditUserAvatarDto
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { ...dto },
      { new: true }
    );

    return user;
  }
}

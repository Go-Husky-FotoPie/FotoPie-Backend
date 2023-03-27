/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UserPostService } from "./user-post.service";

@Controller("profile")
export class UserPost {
  constructor(private userPostService: UserPostService) {}

  @Get(":id")
  async getProfileData(@Param("id") id: string) {
    const userEmail = await this.userPostService.getUserEmailById(id);
    const posts = await this.userPostService.getPostsByUserEmail(userEmail);

    return posts.map(
      ({
        _id,
        filename,
        userEmail,
        price,
        tag,
        orginalFilePath,
        compressFilePath,
      }) => {
        return {
          _id,
          userEmail,
          filename,
          price,
          tag,
          orginalFilePath,
          compressFilePath,
        };
      }
    );
  }

  @Delete(":filename")
  deletePost(@Param("filename") filename: string): Promise<void> {
    return this.userPostService.deletePostByFilename(filename);
  }
}

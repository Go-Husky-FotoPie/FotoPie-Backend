import { IsString } from "class-validator";

export class EditUserAvatarDto {
  @IsString()
  avatar: string;

  @IsString()
  avatarPath: string;
}

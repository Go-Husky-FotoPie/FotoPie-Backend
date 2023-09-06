import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserCollectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly collect_user_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly collected_user_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly filename: string;
}

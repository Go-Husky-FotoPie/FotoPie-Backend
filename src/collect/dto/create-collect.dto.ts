import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCollectDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly filename: string;
}

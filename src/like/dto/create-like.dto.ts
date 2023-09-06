import { IsNotEmpty, IsString } from "class-validator";

export class CreateLikeDto {

    @IsNotEmpty()
    readonly filename: string;
}
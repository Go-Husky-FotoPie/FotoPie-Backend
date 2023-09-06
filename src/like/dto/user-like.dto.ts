import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UserLikeDto {
    @IsNotEmpty()
    @IsString()
    readonly like_user_email: string;

    @IsNotEmpty()
    @IsString()
    readonly liked_user_email: string;

    @IsNotEmpty()
    @IsString()
    readonly filename: string;

    @IsBoolean()
    readonly status?: boolean;
}
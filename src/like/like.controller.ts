import { Controller, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeService } from './like.service';
import { HttpCode, UseGuards } from "@nestjs/common/decorators";
import { Like } from './schemas/like.schema'
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Like")
@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post(":filename")
    @HttpCode(HttpStatus.CREATED)
    async getLike(@Param() createLikeDto:CreateLikeDto, @Req() req: any) {
    const like = new Like()
    like.like_user_email = req.user["email"];
    like.liked_user_email = await this.likeService.findEmailByFilename(createLikeDto);
    like.filename = createLikeDto.filename;
    like.status = false;
    await this.likeService.checkLike(like);
    const likeNumber = await this.likeService.numberLike(createLikeDto)
    return { userLikes:likeNumber }
}
}
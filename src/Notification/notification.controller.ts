import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Notification")
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/latest')
  async getLatestLikes(@Req() req: Request) {
    const currentUserEmail= req.user["email"]
    const likes = await this.notificationService.getLatestLikes(currentUserEmail);

    const filteredLikes = likes.filter(like => like.liked_user_email === currentUserEmail);


    const notifications = await Promise.all(
      filteredLikes.map(async (like) => {
        const users = await this.notificationService.getLikeUsers(like);
        const posts = await this.notificationService.getLikePosts(like);
        const user = users[0];
        const post = posts[0];
        return {
          userAvatar: user?.avatarPath,
          userName: user?.firstName,
          post: post?.compressFilePath,
          directFilename: post?.filename,
          status: like?.status,
          id: like?._id
        };
      }),
    );
    return notifications;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/count')
  async getUnreadCount(@Req() req: Request): Promise< {count: number}> {
    const currentUserEmail= req.user["email"]
    const count = await this.notificationService.getUnreadCount(currentUserEmail);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/mark-read')
  async markAllAsRead(@Req() req: Request): Promise<{ acknowledged: boolean}> {
    const currentUserEmail= req.user["email"]
    const acknowledged = await this.notificationService.markAllAsRead(currentUserEmail);
    return { acknowledged };
  }
}
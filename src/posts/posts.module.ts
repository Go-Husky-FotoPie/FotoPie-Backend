import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './schema/post.schema';
import { MulterModule } from '@nestjs/platform-express/multer';
import { UserModule } from "../user/user.module"
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),  MulterModule.register({ dest: './upload' }),UserModule, AuthModule
    ],
  
  controllers: [PostsController,],
  providers: [PostsService, ]
})
export class PostsModule {}

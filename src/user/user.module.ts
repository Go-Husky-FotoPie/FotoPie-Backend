import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailgunModule } from 'nestjs-mailgun'
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }],),
    
    JwtModule.register({}),
    
   
    ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
  
})
export class UserModule {}

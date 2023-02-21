import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailgunModule } from 'nestjs-mailgun'





@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), UserModule, 



  ],

})
export class AppModule {}

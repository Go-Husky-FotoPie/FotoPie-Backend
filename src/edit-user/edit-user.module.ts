import { EditUserController } from "./edit-user.controller";
import { EditUserService } from "./edit-user.service";
import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EditUserController],
  providers: [EditUserService],
})
export class EditUserModule {}

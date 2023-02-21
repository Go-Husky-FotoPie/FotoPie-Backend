import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose,{ HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true,versionKey: false})
export class User {
    // @Prop()
     _id: mongoose.Schema.Types.ObjectId;


    @Prop({ required: true })
    firstName: String;


    @Prop({ required: true })
    lastName: String;
   

    @Prop({ required: true, unique: true })
    email: String;


    @Prop({ required: true })
    password: String;


    @Prop({ default: "user", type: String, enum: ["user", "admin"] })
    role: string;

    

    @Prop()
    refreshToken: string;
   
}    
    
export const UserSchema = SchemaFactory.createForClass(User);

      

import { ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.fto';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt'

import VerificationTokenPayload from './interface/verificationTokenPayload.interface';

import { BadRequestException, Injectable ,UnauthorizedException} from '@nestjs/common'


const bcrypt = require("bcryptjs");





@Injectable()
export class UserService {


    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
  

    ) { }
    


    
    async doesUserExists(createUserDTO: CreateUserDto): Promise<User> {
        const user = await this.userModel.findOne({ email: createUserDTO.email });
        if (user) {
            throw new ConflictException('User already exist')
            
        }
       
        return user
    }





    public sendVerificationLink(email: string, firstName: string, lastName: string, password: string) {
        const payload: VerificationTokenPayload = { email, firstName, lastName, password };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACTIVIATE_SECRET_KEY,
            expiresIn: process.env.EXPIRE
        });
     
        const url = `${process.env.EMAIL_CONFIRMATION_URL}/${token}`;
     
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
        const mailgun = require("mailgun-js");
        const DOMAIN = process.env.DOMAIN;
        const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
        


        try {

            return mg.messages().send({
                from: process.env.EMAIL_SEND,
                to: email,
                subject: 'Email confirmation',
                text,
            })
            
        }catch (error) {
            throw new BadRequestException("Failed to send email");
          }
        
    }



    
    public async decodeConfirmationToken(token: string) {
        
        const payload = await this.jwtService.verify(token, {
            secret: process.env.JWT_ACTIVIATE_SECRET_KEY,
        });

 
        const { firstName, lastName, email, password } = payload

 
        const hash = await bcrypt.hash(password, 5);
        if ((await this.userModel.findOne({ email }))) {
            throw new ConflictException('User already exist');
        }
        else {
            try {
                const createduser = await this.userModel.create({ firstName, lastName, password: hash, email });
                return { createduser };
            

            }

            catch (error) {
                throw new UnauthorizedException("Invalid Token");
            }
     
        }
    }
    

   
}

    
   
             
    
    

   
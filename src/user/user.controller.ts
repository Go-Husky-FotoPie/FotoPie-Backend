

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.fto';
import { ConfirmEmailDto } from './dto/confirmEmail.dto'
import { User } from './schemas/user.schema';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { Req,Res} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt'


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
  ) { }
    

  // send email
  @Post('/create')
  async addUser(@Res() res, @Body() createUserDTO: CreateUserDto): Promise<User> {
    if (await this.userService.doesUserExists(createUserDTO)) {
      return res.status(HttpStatus.CONFLICT).json({
        message: "User already exists"
      })
    }
    await this.userService.sendVerificationLink(createUserDTO.email, createUserDTO.firstName, createUserDTO.lastName, createUserDTO.password);
    return res.status(HttpStatus.OK).json({
      message: "Email has been sent, kindly activate your account "
    });
  }


  //create user 
  @Post('/signup')

  async register(@Res() res, @Body() ConfirmEmailDto: ConfirmEmailDto): Promise<User> {
    
    await this.userService.decodeConfirmationToken(ConfirmEmailDto.token);

      return res.status(HttpStatus.CREATED).json({
        message: "Confirmed "
      })
  
  
    }
    
  }




  
  

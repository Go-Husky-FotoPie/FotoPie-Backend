import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { Token } from "./types/tokens.type";
import { AdminAuthService } from "./admin-auth.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Admin Auth")
@Controller("admin-auth")
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}
  @Post("login")
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<Token> {
    return this.adminAuthService.adminLogin(adminLoginDto);
  }



  // @Post("logout")
  // @HttpCode(HttpStatus.OK)
  // logout(@Req() req: Request) {
  //   const user = req.body;
  //   return this.adminAuthService.logout(user["email"]);
  // }
}

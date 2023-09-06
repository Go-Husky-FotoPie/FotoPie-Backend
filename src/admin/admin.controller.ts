import { Controller, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("user")
  async getAllUsers() {
    return this.adminService.findAllUser();
  }

}

import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ResetService } from "./reset.service";
import { ResetRequestDto } from "./dto/reset-request.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Reset")
@Controller("reset")
export class ResetController {
  constructor(private resetService: ResetService) {}

  @Post("resetRequest")
  @HttpCode(HttpStatus.OK)
  async resetRequest(
    @Body() email: ResetRequestDto
  ): Promise<{ message: string }> {
    return this.resetService.resetRequest(email);
  }

  @Post("resetPassword")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() credentials: { token: string; password: string }
  ): Promise<{ message: string }> {
    return this.resetService.resetPassword(
      credentials.token,
      credentials.password
    );
  }
}

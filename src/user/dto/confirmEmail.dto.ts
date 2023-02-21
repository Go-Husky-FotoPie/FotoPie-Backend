
import { IsString, IsNotEmpty } from 'class-validator';
 
export class ConfirmEmailDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
 
export default ConfirmEmailDto;
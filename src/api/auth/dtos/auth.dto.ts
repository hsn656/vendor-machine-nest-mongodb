import { IsNotEmpty } from 'class-validator';

export class registerDTO {
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  public password: string;
}

export class PayloadDto {
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  public id: number;
}

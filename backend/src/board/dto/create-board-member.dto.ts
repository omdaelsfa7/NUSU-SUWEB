import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  committee: string;

  @IsString()
  @IsOptional()
  major?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}

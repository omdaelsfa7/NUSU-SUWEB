import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}

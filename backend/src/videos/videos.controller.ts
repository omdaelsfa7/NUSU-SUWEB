import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async findAll() {
    return this.videosService.findAll();
  }

  @Post()
  async create(@Body() createDto: CreateVideoDto) {
    return this.videosService.create(createDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}

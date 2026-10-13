import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.highlightVideo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const video = await this.prisma.highlightVideo.findUnique({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Highlight video with id "${id}" not found.`);
    }
    return video;
  }

  async create(dto: CreateVideoDto) {
    const poster = dto.posterUrl || dto.thumbnailUrl;
    return this.prisma.highlightVideo.create({
      data: {
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,
        posterUrl: poster,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.highlightVideo.delete({
      where: { id },
    });
  }
}

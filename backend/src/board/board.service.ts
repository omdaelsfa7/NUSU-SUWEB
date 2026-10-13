import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.boardMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.boardMember.findUnique({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Board member with id "${id}" not found.`);
    }
    return member;
  }

  async create(dto: CreateBoardMemberDto) {
    return this.prisma.boardMember.create({
      data: {
        ...dto,
        imageUrl: dto.imageUrl || 'http://localhost:9000/suweb-media/default-avatar.png',
      },
    });
  }

  async update(id: string, dto: UpdateBoardMemberDto) {
    await this.findOne(id);
    return this.prisma.boardMember.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.boardMember.delete({
      where: { id },
    });
  }
}

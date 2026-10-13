import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: loginDto.email.toLowerCase().trim() },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { sub: admin.id, email: admin.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}

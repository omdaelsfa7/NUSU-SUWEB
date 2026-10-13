import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;
  private endpoint: string;
  private port: number;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    this.port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10);
    this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'suweb-media');

    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadminpassword'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
      } else {
        this.logger.log(`Bucket "${this.bucketName}" already exists.`);
      }

      // Set public read policy
      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(publicPolicy));
      this.logger.log(`Public read policy applied to bucket "${this.bucketName}".`);
    } catch (error) {
      this.logger.error(`Failed to configure MinIO bucket "${this.bucketName}":`, error);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string; originalName: string; size: number; mimetype: string }> {
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectName = `${Date.now()}_${sanitizedOriginalName}`;

    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype || 'application/octet-stream',
      },
    );

    const publicUrl = `http://${this.endpoint}:${this.port}/${this.bucketName}/${objectName}`;
    return {
      url: publicUrl,
      filename: objectName,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

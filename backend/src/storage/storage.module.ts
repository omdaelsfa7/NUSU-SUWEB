import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { StorageController } from './storage.controller';

@Module({
  controllers: [StorageController],
  providers: [MinioService],
  exports: [MinioService],
})
export class StorageModule {}

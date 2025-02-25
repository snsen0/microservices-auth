import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { HashService } from './hash.service';

@Module({
  providers: [LoggerService, HashService],
  exports: [LoggerService, HashService],
})
export class SharedModule {}

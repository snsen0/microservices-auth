import { Injectable, Logger } from '@nestjs/common';

// LoggerService, @nestjs/common paketindeki Logger sınıfını sarar ve loglama işlemlerini gerçekleştirir.

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}

import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [HttpClientService],
  imports: [AuthModule],
  exports: [HttpClientService],
})
export class HttpClientModule {}

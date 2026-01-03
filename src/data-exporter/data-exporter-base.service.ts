import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DataExporterBaseService {
  abstract exportAsync(data: Array<object>): Promise<Buffer>;
}

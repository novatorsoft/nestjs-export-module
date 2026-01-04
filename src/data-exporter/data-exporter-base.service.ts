import { DataExportArgs } from './dto/data-export-args.dto';
import { DataExportResult } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DataExporterBaseService {
  abstract exportAsync(
    dataExportArgs: DataExportArgs,
  ): Promise<DataExportResult>;
}

import { DATA_EXPORTER_FACTORY_TOKEN } from '../../constants';
import { DataExportResult } from '../../dto';
import { DataExporterBaseService } from '../../data-exporter-base.service';
import { DataExporterType } from '../../enum';
import { FactoryProvider } from 'nestjs-factory-pattern-module';
import { Injectable } from '@nestjs/common';
import { json2csv } from 'json-2-csv';

@Injectable()
@FactoryProvider(DATA_EXPORTER_FACTORY_TOKEN, DataExporterType.CSV)
export class CsvService extends DataExporterBaseService {
  exportAsync(data: Array<object>): Promise<DataExportResult> {
    const csv = json2csv(data);
    return Promise.resolve({
      mimeType: 'text/csv',
      extension: 'csv',
      data: Buffer.from(csv, 'utf-8'),
    });
  }
}

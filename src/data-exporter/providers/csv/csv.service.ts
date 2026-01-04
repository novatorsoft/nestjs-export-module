import { CsvDataExportArgs } from './dto';
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
  exportAsync(dataExportArgs: CsvDataExportArgs): Promise<DataExportResult> {
    const csv = json2csv(dataExportArgs.data, {
      keys: dataExportArgs.options?.headers,
      fieldTitleMap: dataExportArgs.options?.headersMap,
      delimiter: {
        field: dataExportArgs.options?.delimiter ?? ',',
        wrap: dataExportArgs.options?.quote,
      },
    });
    return Promise.resolve({
      mimeType: 'text/csv',
      extension: 'csv',
      data: Buffer.from(csv ?? '', dataExportArgs.options?.encoding ?? 'utf-8'),
    });
  }
}

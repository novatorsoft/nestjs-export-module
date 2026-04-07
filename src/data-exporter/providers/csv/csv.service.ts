import { DataExportResult, PaginationArgs } from '../../dto';

import { CsvDataExportArgs } from './dto';
import { DATA_EXPORTER_FACTORY_TOKEN } from '../../constants';
import { DataExporterBaseService } from '../../data-exporter-base.service';
import { DataExporterType } from '../../enum';
import { FactoryProvider } from 'nestjs-factory-pattern-module';
import { Injectable } from '@nestjs/common';
import { json2csv } from 'json-2-csv';

@Injectable()
@FactoryProvider(DATA_EXPORTER_FACTORY_TOKEN, DataExporterType.CSV)
export class CsvService extends DataExporterBaseService {
  async exportAsync(
    dataExportArgs: CsvDataExportArgs,
  ): Promise<DataExportResult> {
    let data: Buffer;
    if (Array.isArray(dataExportArgs.data)) {
      data = this.exportObject(dataExportArgs.data, dataExportArgs);
    } else {
      data = await this.exportPaginationArgsAsync(dataExportArgs);
    }

    return {
      mimeType: 'text/csv',
      extension: 'csv',
      data: data,
    };
  }

  private exportObject(
    rows: Array<object>,
    dataExportArgs: CsvDataExportArgs,
    includeHeaders: boolean = true,
  ): Buffer {
    const data = json2csv(rows, {
      keys: dataExportArgs.options?.headers,
      fieldTitleMap: dataExportArgs.options?.headersMap,
      prependHeader: includeHeaders,
      delimiter: {
        field: dataExportArgs.options?.delimiter ?? ',',
        wrap: dataExportArgs.options?.quote,
      },
    });

    return Buffer.from(data, dataExportArgs.options?.encoding ?? 'utf-8');
  }

  private async exportPaginationArgsAsync(
    dataExportArgs: CsvDataExportArgs,
  ): Promise<Buffer> {
    const limit = dataExportArgs.paginationOptions?.limit ?? 100;
    const encoding = dataExportArgs.options?.encoding ?? 'utf-8';
    const newline = Buffer.from('\n', encoding);

    const chunks: Buffer[] = [];
    let offset = 0;
    let result: { data: Array<object>; nextCursor?: string } = {
      data: [],
    };

    do {
      result = await (
        dataExportArgs.data as (
          args: PaginationArgs,
        ) => Promise<{ data: Array<object>; nextCursor?: string }>
      )({
        limit,
        ...(result.nextCursor ? { nextCursor: result.nextCursor } : { offset }),
        ...(dataExportArgs?.paginationOptions?.data && {
          data: dataExportArgs?.paginationOptions?.data,
        }),
      });

      if (!result.data.length) break;

      const chunk = this.exportObject(
        result.data,
        dataExportArgs,
        offset === 0,
      );

      if (offset !== 0) chunks.push(newline);
      chunks.push(chunk);

      offset += limit;
    } while (result.data.length === limit);

    return Buffer.concat(chunks);
  }
}

import * as ExcelJS from 'exceljs';

import { DATA_EXPORTER_FACTORY_TOKEN } from '../../constants';
import { DataExportResult } from 'src/data-exporter/dto';
import { DataExporterBaseService } from 'src/data-exporter/data-exporter-base.service';
import { DataExporterType } from '../../enum';
import { ExcelDataExportArgs } from './dto';
import { FactoryProvider } from 'nestjs-factory-pattern-module';
import { Injectable } from '@nestjs/common';

@Injectable()
@FactoryProvider(DATA_EXPORTER_FACTORY_TOKEN, DataExporterType.EXCEL)
export class ExcelService extends DataExporterBaseService {
  async exportAsync(
    dataExportArgs: ExcelDataExportArgs,
  ): Promise<DataExportResult> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      dataExportArgs.options?.sheetName ?? 'Sheet1',
    );
    worksheet.columns = this.getHeaders(
      dataExportArgs.data.at(0) ?? {},
      dataExportArgs.options,
    );
    worksheet.addRows(dataExportArgs.data);
    const data = await workbook.xlsx.writeBuffer();
    return {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
      data: data as unknown as Buffer,
    };
  }

  getHeaders(
    firstRowData: object,
    options?: ExcelDataExportArgs['options'],
  ): Array<Partial<ExcelJS.Column>> {
    let result: Array<Partial<ExcelJS.Column>> = [];

    if (options?.headers)
      result = options?.headers?.map((header) => ({
        header: options?.headersMap?.[header] ?? header,
        key: header,
        ...(options?.columnOptions?.[header] &&
          options?.columnOptions?.[header]),
      }));
    else
      result = Object.keys(firstRowData).map((property) => ({
        header: property,
        key: property,
        ...(options?.columnOptions?.[property] &&
          options?.columnOptions?.[property]),
      }));

    return result;
  }
}

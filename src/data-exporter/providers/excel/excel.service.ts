import * as ExcelJS from 'exceljs';

import { DATA_EXPORTER_FACTORY_TOKEN } from '../../constants';
import { DataExportResult } from '../../dto';
import { DataExporterBaseService } from '../../data-exporter-base.service';
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

  private getHeaders(
    firstRowData: object,
    options?: ExcelDataExportArgs['options'],
  ): Array<Partial<ExcelJS.Column>> {
    let result: Array<Partial<ExcelJS.Column>> = [];

    if (options?.headers)
      result = options?.headers?.map((header) => {
        const columnOption = options?.columnOptions?.[header] ?? {};
        return {
          header: options?.headersMap?.[header] ?? header,
          key: header,
          ...columnOption,
        };
      });
    else
      result = Object.keys(firstRowData).map((property) => {
        const columnOption = options?.columnOptions?.[property];
        return {
          header: property,
          key: property,
          ...columnOption,
        };
      });

    console.log(result);

    return result;
  }
}

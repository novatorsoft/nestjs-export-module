import * as ExcelJS from 'exceljs';

import { DataExportResult, PaginatedData } from '../../dto';

import { DATA_EXPORTER_FACTORY_TOKEN } from '../../constants';
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

    if (Array.isArray(dataExportArgs.data)) {
      worksheet.columns = this.getHeaders(
        dataExportArgs.data.at(0) ?? {},
        dataExportArgs.options,
      );
      worksheet.addRows(dataExportArgs.data);
    } else await this.addDataToWorksheetAsync(dataExportArgs, worksheet);

    const data = await workbook.xlsx.writeBuffer();
    return {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
      data: data as unknown as Buffer,
    };
  }

  private async addDataToWorksheetAsync(
    dataExportArgs: ExcelDataExportArgs,
    worksheet: ExcelJS.Worksheet,
  ): Promise<void> {
    const limit = dataExportArgs.paginationOptions?.limit ?? 100;
    let offset = 0;
    let result: { data: Array<object>; nextCursor?: string } = {
      data: [],
    };

    do {
      result = await (
        dataExportArgs.data as (
          args: PaginatedData,
        ) => Promise<{ data: Array<object>; nextCursor?: string }>
      )({
        limit,
        ...(result.nextCursor ? { nextCursor: result.nextCursor } : { offset }),
        ...(dataExportArgs?.paginationOptions?.data && {
          data: dataExportArgs?.paginationOptions?.data,
        }),
      });

      if (offset === 0)
        worksheet.columns = this.getHeaders(
          result.data.at(0) ?? {},
          dataExportArgs.options,
        );

      worksheet.addRows(result.data);
      offset += limit;
    } while (result.data.length === limit);
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
          header: options?.headersMap?.[property] ?? property,
          key: property,
          ...columnOption,
        };
      });

    return result;
  }
}

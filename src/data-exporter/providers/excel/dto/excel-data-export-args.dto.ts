import { DataExportBaseArgs } from '../../../dto/data-export-args.dto';
import { DataExporterType } from '../../../enum';

export class ExcelDataExportArgs extends DataExportBaseArgs {
  readonly type = DataExporterType.EXCEL;

  options?: {
    headers?: Array<string>;
    headersMap?: Record<string, string>;
    sheetName?: string;
    columnOptions?: Record<
      string,
      {
        width?: number;
        style?: {
          numFmt?: string;
        };
      }
    >;
  };
}

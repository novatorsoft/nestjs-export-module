import { CsvDataExportArgs, ExcelDataExportArgs } from '../providers';

import { DataExporterType } from '../enum';

export class PaginationArgs {
  limit?: number;
  offset?: number;
  nextCursor?: string;
  data?: Record<string, any>;
}

export class DataExportBaseArgs {
  type: DataExporterType;
  paginationOptions?: {
    limit?: number;
    data?: Record<string, any>;
  };
  data:
    | Array<object>
    | ((args: PaginationArgs) => Promise<{
        data: Array<object>;
        nextCursor?: string;
      }>);
}

export type DataExportArgs = CsvDataExportArgs | ExcelDataExportArgs;

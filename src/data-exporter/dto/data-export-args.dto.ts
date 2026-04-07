import { CsvDataExportArgs, ExcelDataExportArgs } from '../providers';

import { DataExporterType } from '../enum';

export class PaginatedData {
  limit?: number;
  offset?: number;
  nextCursor?: string;
}

export class DataExportBaseArgs {
  type: DataExporterType;
  data:
    | Array<object>
    | ((args: PaginatedData) => Promise<{
        data: Array<object>;
        nextCursor?: string;
      }>);
}

export type DataExportArgs = CsvDataExportArgs | ExcelDataExportArgs;

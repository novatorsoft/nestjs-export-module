import { CsvDataExportArgs } from '../providers';
import { DataExporterType } from '../enum';

export class DataExportBaseArgs {
  type: DataExporterType;
  data: Array<object>;
}

export type DataExportArgs = CsvDataExportArgs;

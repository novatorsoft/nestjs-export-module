import { DataExportBaseArgs } from '../../../dto/data-export-args.dto';
import { DataExporterType } from '../../../enum';

export class CsvDataExportArgs extends DataExportBaseArgs {
  readonly type = DataExporterType.CSV;

  options?: {
    headers?: Array<string>;
    headersMap?: Record<string, string>;
    delimiter?: string;
    quote?: string;
    encoding?: BufferEncoding;
  };
}

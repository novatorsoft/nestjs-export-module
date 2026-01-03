import { CsvService } from './providers/csv/csv.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [CsvService],
})
export class DataExporterModule {}

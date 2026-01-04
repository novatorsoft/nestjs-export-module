import { CsvService } from './providers';
import { DATA_EXPORTER_FACTORY_TOKEN } from './constants';
import { DataExporterService } from './data-exporter.service';
import { ExcelService } from './providers/excel/excel.service';
import { FactoryModule } from 'nestjs-factory-pattern-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    FactoryModule.register({
      factoryName: DATA_EXPORTER_FACTORY_TOKEN,
    }),
  ],
  providers: [DataExporterService, CsvService, ExcelService],
  exports: [DataExporterService],
})
export class DataExporterModule {}

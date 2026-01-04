import { CsvService } from './providers/csv/csv.service';
import { DATA_EXPORTER_FACTORY_TOKEN } from './constants';
import { DataExporterService } from './data-exporter.service';
import { FactoryModule } from 'nestjs-factory-pattern-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    FactoryModule.register({
      factoryName: DATA_EXPORTER_FACTORY_TOKEN,
    }),
  ],
  providers: [CsvService, DataExporterService],
  exports: [DataExporterService],
})
export class DataExporterModule {}

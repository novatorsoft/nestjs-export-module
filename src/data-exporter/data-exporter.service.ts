import { Injectable } from '@nestjs/common';
import { FactoryService, InjectFactory } from 'nestjs-factory-pattern-module';
import { DATA_EXPORTER_FACTORY_TOKEN } from './constants';
import { DataExporterBaseService } from './data-exporter-base.service';
import { DataExportResult } from './dto';
import { DataExportArgs } from './dto/data-export-args.dto';

@Injectable()
export class DataExporterService {
  constructor(
    @InjectFactory(DATA_EXPORTER_FACTORY_TOKEN)
    private readonly dataExporterFactory: FactoryService<DataExporterBaseService>,
  ) {}

  async exportAsync(dataExportArgs: DataExportArgs): Promise<DataExportResult> {
    const dataExporter = await this.dataExporterFactory.getProviderServiceAsync(
      dataExportArgs.type,
    );
    return dataExporter.exportAsync(dataExportArgs);
  }
}

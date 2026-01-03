import { Injectable } from '@nestjs/common';
import { FactoryService, InjectFactory } from 'nestjs-factory-pattern-module';
import { DATA_EXPORTER_FACTORY_TOKEN } from './constants';
import { DataExporterBaseService } from './data-exporter-base.service';
import { DataExporterType } from './enum';

@Injectable()
export class DataExporterService {
  constructor(
    @InjectFactory(DATA_EXPORTER_FACTORY_TOKEN)
    private readonly dataExporterFactory: FactoryService<DataExporterBaseService>,
  ) {}

  async exportAsync(
    type: DataExporterType,
    data: Array<object>,
  ): Promise<Buffer> {
    const dataExporter =
      await this.dataExporterFactory.getProviderServiceAsync(type);
    return dataExporter.exportAsync(data);
  }
}

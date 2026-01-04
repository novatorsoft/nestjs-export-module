import { Test, TestingModule } from '@nestjs/testing';

import { CsvService } from './providers/csv/csv.service';
import { DataExporterModule } from './data-exporter.module';
import { DataExporterService } from './data-exporter.service';

describe('DataExporterModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DataExporterModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide DataExporterService', () => {
    const service = module.get<DataExporterService>(DataExporterService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(DataExporterService);
  });

  it('should provide CsvService', () => {
    const service = module.get<CsvService>(CsvService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(CsvService);
  });

  it('should export DataExporterService', () => {
    const exportedService =
      module.get<DataExporterService>(DataExporterService);
    expect(exportedService).toBeDefined();
  });

  it('should have all required providers', () => {
    const dataExporterService =
      module.get<DataExporterService>(DataExporterService);
    const csvService = module.get<CsvService>(CsvService);

    expect(dataExporterService).toBeDefined();
    expect(csvService).toBeDefined();
  });
});

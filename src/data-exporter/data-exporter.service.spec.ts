import { Test, TestingModule } from '@nestjs/testing';

import { DATA_EXPORTER_FACTORY_TOKEN } from './constants';
import { DataExportResult } from './dto';
import { DataExporterBaseService } from './data-exporter-base.service';
import { DataExporterService } from './data-exporter.service';
import { DataExporterType } from './enum';
import { FactoryService } from 'nestjs-factory-pattern-module';

describe('DataExporterService', () => {
  let service: DataExporterService;
  let mockFactoryService: jest.Mocked<FactoryService<DataExporterBaseService>>;
  let mockDataExporter: jest.Mocked<DataExporterBaseService>;

  beforeEach(async () => {
    mockDataExporter = {
      exportAsync: jest.fn(),
    };

    mockFactoryService = {
      getProviderServiceAsync: jest.fn(),
    } as unknown as jest.Mocked<FactoryService<DataExporterBaseService>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataExporterService,
        {
          provide: DATA_EXPORTER_FACTORY_TOKEN,
          useValue: mockFactoryService,
        },
      ],
    }).compile();

    service = module.get<DataExporterService>(DataExporterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportAsync', () => {
    it('should call factory service and return export result', async () => {
      const testData: Array<object> = [{ id: 1, name: 'Test' }];
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('test data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(DataExporterType.CSV, testData);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testData,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty data array', async () => {
      const testData: Array<object> = [];
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(DataExporterType.CSV, testData);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testData,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle large data arrays', async () => {
      const testData: Array<object> = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
      }));
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('large csv data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(DataExporterType.CSV, testData);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testData,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from factory service', async () => {
      const testData: Array<object> = [{ id: 1, name: 'Test' }];
      const error = new Error('Factory service error');

      mockFactoryService.getProviderServiceAsync.mockRejectedValue(error);

      await expect(
        service.exportAsync(DataExporterType.CSV, testData),
      ).rejects.toThrow('Factory service error');
    });

    it('should propagate errors from data exporter', async () => {
      const testData: Array<object> = [{ id: 1, name: 'Test' }];
      const error = new Error('Export error');

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockRejectedValue(error);

      await expect(
        service.exportAsync(DataExporterType.CSV, testData),
      ).rejects.toThrow('Export error');
    });

    it('should work with different exporter types', async () => {
      const testData: Array<object> = [{ id: 1, name: 'Test' }];
      const expectedResult: DataExportResult = {
        mimeType: 'application/json',
        extension: 'json',
        data: Buffer.from('{}', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(DataExporterType.CSV, testData);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(result).toEqual(expectedResult);
    });
  });
});

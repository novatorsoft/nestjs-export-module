import { Test, TestingModule } from '@nestjs/testing';

import { CsvDataExportArgs } from './providers/csv/dto';
import { ExcelDataExportArgs } from './providers/excel/dto';
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
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8' as BufferEncoding,
        },
      };
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('test data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testDataExportArgs,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty data array', async () => {
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [],
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8',
        },
      };
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testDataExportArgs,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle large data arrays', async () => {
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `Test ${i + 1}`,
        })),
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8',
        },
      };
      const expectedResult: DataExportResult = {
        mimeType: 'text/csv',
        extension: 'csv',
        data: Buffer.from('large csv data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testDataExportArgs,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from factory service', async () => {
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8' as BufferEncoding,
        },
      };
      const error = new Error('Factory service error');

      mockFactoryService.getProviderServiceAsync.mockRejectedValue(error);

      await expect(service.exportAsync(testDataExportArgs)).rejects.toThrow(
        'Factory service error',
      );
    });

    it('should propagate errors from data exporter', async () => {
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8' as BufferEncoding,
        },
      };
      const error = new Error('Export error');

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockRejectedValue(error);

      await expect(service.exportAsync(testDataExportArgs)).rejects.toThrow(
        'Export error',
      );
    });

    it('should work with Excel exporter type', async () => {
      const testDataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test' }],
        options: {
          sheetName: 'TestSheet',
        },
      };
      const expectedResult: DataExportResult = {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
        data: Buffer.from('excel data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.EXCEL);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testDataExportArgs,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should work with Excel exporter with columnOptions', async () => {
      const testDataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test', price: 99.99 }],
        options: {
          columnOptions: {
            id: { width: 20 },
            price: { style: { numFmt: '#,##0.00' } },
          },
        },
      };
      const expectedResult: DataExportResult = {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
        data: Buffer.from('excel data', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.EXCEL);
      expect(jest.spyOn(mockDataExporter, 'exportAsync')).toHaveBeenCalledWith(
        testDataExportArgs,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should work with different exporter types', async () => {
      const testDataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          delimiter: ',',
          quote: '"',
          encoding: 'utf-8' as BufferEncoding,
        },
      };
      const expectedResult: DataExportResult = {
        mimeType: 'application/json',
        extension: 'json',
        data: Buffer.from('{}', 'utf-8'),
      };

      mockFactoryService.getProviderServiceAsync.mockResolvedValue(
        mockDataExporter,
      );
      mockDataExporter.exportAsync.mockResolvedValue(expectedResult);

      const result = await service.exportAsync(testDataExportArgs);

      expect(
        jest.spyOn(mockFactoryService, 'getProviderServiceAsync'),
      ).toHaveBeenCalledWith(DataExporterType.CSV);
      expect(result).toEqual(expectedResult);
    });
  });
});

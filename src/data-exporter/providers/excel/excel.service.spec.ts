import * as ExcelJS from 'exceljs';

import { Test, TestingModule } from '@nestjs/testing';

import { DataExportResult, PaginatedData } from '../../dto';
import { DataExporterType } from '../../enum';
import { ExcelDataExportArgs } from './dto';
import { ExcelService } from './excel.service';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelService],
    }).compile();

    service = module.get<ExcelService>(ExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportAsync', () => {
    it('should export empty array to Excel', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(result.extension).toBe('xlsx');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should export single object to Excel', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test', email: 'test@example.com' }],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(result.extension).toBe('xlsx');
      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should export multiple objects to Excel', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, name: 'Test 1', email: 'test1@example.com' },
          { id: 2, name: 'Test 2', email: 'test2@example.com' },
          { id: 3, name: 'Test 3', email: 'test3@example.com' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(result.extension).toBe('xlsx');
      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should use custom sheet name when provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test' }],
        options: {
          sheetName: 'CustomSheet',
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(result.extension).toBe('xlsx');
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      expect(workbook.worksheets[0].name).toBe('CustomSheet');
    });

    it('should use default sheet name when not provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test' }],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      expect(workbook.worksheets[0].name).toBe('Sheet1');
    });

    it('should use headers when provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test', email: 'test@example.com', age: 25 }],
        options: {
          headers: ['id', 'name'],
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      expect(worksheet.getRow(1).getCell(1).value).toBe('id');
      expect(worksheet.getRow(1).getCell(2).value).toBe('name');
    });

    it('should use headersMap when provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test' }],
        options: {
          headers: ['id', 'name'],
          headersMap: { id: 'ID', name: 'Name' },
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      expect(worksheet.getRow(1).getCell(1).value).toBe('ID');
      expect(worksheet.getRow(1).getCell(2).value).toBe('Name');
    });

    it('should use columnOptions with width when provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, name: 'Test' }],
        options: {
          columnOptions: {
            id: { width: 20 },
            name: { width: 30 },
          },
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      const idColumn = worksheet.getColumn(1);
      const nameColumn = worksheet.getColumn(2);
      expect(idColumn.width).toBe(20);
      expect(nameColumn.width).toBe(30);
    });

    it('should use columnOptions with numFmt when provided', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, price: 99.99 }],
        options: {
          columnOptions: {
            price: {
              style: {
                numFmt: '#,##0.00',
              },
            },
          },
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      const priceColumn = worksheet.getColumn(2);
      expect(priceColumn.numFmt).toBe('#,##0.00');
    });

    it('should use columnOptions with both width and numFmt', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [{ id: 1, amount: 1234.56 }],
        options: {
          columnOptions: {
            amount: {
              width: 15,
              style: {
                numFmt: '$#,##0.00',
              },
            },
          },
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      const amountColumn = worksheet.getColumn(2);
      expect(amountColumn.width).toBe(15);
      expect(amountColumn.numFmt).toBe('$#,##0.00');
    });

    it('should handle objects with different properties', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, name: 'Test' },
          { id: 2, name: 'Test 2', age: 25 },
          { id: 3, name: 'Test 3', age: 30, city: 'Istanbul' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(result.extension).toBe('xlsx');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle numeric values correctly', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, price: 99.99, quantity: 10 },
          { id: 2, price: 199.99, quantity: 5 },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle boolean values correctly', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, active: true, verified: false },
          { id: 2, active: false, verified: true },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle null values', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, name: 'Test', email: null },
          { id: 2, name: null, email: 'test@example.com' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle date values', async () => {
      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: [
          { id: 1, name: 'Test', createdAt: new Date('2024-01-01') },
          { id: 2, name: 'Test 2', createdAt: new Date('2024-01-02') },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should export using paginated loader with offset when nextCursor is absent', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Row ${i + 1}`,
      }));
      const page2 = [{ id: 101, name: 'Row 101' }];

      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((args: PaginatedData): Promise<LoaderResult> => {
        if (args.offset === 0) {
          expect(args.limit).toBe(100);
          expect(args.nextCursor).toBeUndefined();
          return Promise.resolve({ data: page1 });
        }
        if (args.offset === 100) {
          expect(args.limit).toBe(100);
          return Promise.resolve({ data: page2 });
        }
        return Promise.resolve({ data: [] });
      });

      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: loader,
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(loader).toHaveBeenCalledTimes(2);
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      expect(worksheet.getRow(2).getCell(1).value).toBe(1);
      expect(worksheet.getRow(102).getCell(1).value).toBe(101);
    });

    it('should export using paginated loader with nextCursor when present', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
      }));
      const page2 = [{ id: 101 }];

      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((args: PaginatedData): Promise<LoaderResult> => {
        if (args.nextCursor === undefined) {
          expect(args.offset).toBe(0);
          expect(args.limit).toBe(100);
          return Promise.resolve({ data: page1, nextCursor: 'next-page' });
        }
        expect(args.nextCursor).toBe('next-page');
        expect(args.offset).toBeUndefined();
        return Promise.resolve({ data: page2 });
      });

      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: loader,
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(loader).toHaveBeenCalledTimes(2);
      expect(result.data).toBeInstanceOf(Buffer);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      expect(worksheet.getRow(2).getCell(1).value).toBe(1);
      expect(worksheet.getRow(102).getCell(1).value).toBe(101);
    });

    it('should apply options.headers when first page comes from paginated loader', async () => {
      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((): Promise<LoaderResult> => {
        return Promise.resolve({
          data: [{ id: 1, name: 'A', extra: 'x' }],
        });
      });

      const dataExportArgs: ExcelDataExportArgs = {
        type: DataExporterType.EXCEL,
        data: loader,
        options: {
          headers: ['id', 'name'],
        },
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(result.data).toBeInstanceOf(Buffer);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(result.data as unknown as ExcelJS.Buffer);
      const worksheet = workbook.worksheets[0];
      expect(worksheet.getRow(1).getCell(1).value).toBe('id');
      expect(worksheet.getRow(1).getCell(2).value).toBe('name');
      expect(worksheet.getRow(2).getCell(1).value).toBe(1);
      expect(worksheet.getRow(2).getCell(2).value).toBe('A');
    });
  });
});

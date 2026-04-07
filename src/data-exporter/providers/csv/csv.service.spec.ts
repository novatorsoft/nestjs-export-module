import { DataExportResult, PaginationArgs } from '../../dto';
import { Test, TestingModule } from '@nestjs/testing';

import { CsvDataExportArgs } from './dto';
import { CsvService } from './csv.service';
import { DataExporterType } from '../../enum';

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportAsync', () => {
    it('should export empty array to CSV', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should export single object to CSV', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test', email: 'test@example.com' }],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
      const csvContent = result.data.toString('utf-8');
      expect(csvContent).toContain('id');
      expect(csvContent).toContain('name');
      expect(csvContent).toContain('email');
      expect(csvContent).toContain('1');
      expect(csvContent).toContain('Test');
      expect(csvContent).toContain('test@example.com');
    });

    it('should export multiple objects to CSV', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, name: 'Test 1', email: 'test1@example.com' },
          { id: 2, name: 'Test 2', email: 'test2@example.com' },
          { id: 3, name: 'Test 3', email: 'test3@example.com' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
      const csvContent = result.data.toString('utf-8');
      expect(csvContent).toContain('1');
      expect(csvContent).toContain('2');
      expect(csvContent).toContain('3');
      expect(csvContent).toContain('Test 1');
      expect(csvContent).toContain('Test 2');
      expect(csvContent).toContain('Test 3');
    });

    it('should handle objects with different properties', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, name: 'Test' },
          { id: 2, name: 'Test 2', age: 25 },
          { id: 3, name: 'Test 3', age: 30, city: 'Istanbul' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle special characters in data', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, name: 'Test, with comma', description: 'Test "quotes"' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle numeric values correctly', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, price: 99.99, quantity: 10 },
          { id: 2, price: 199.99, quantity: 5 },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
      const csvContent = result.data.toString('utf-8');
      expect(csvContent).toContain('99.99');
      expect(csvContent).toContain('199.99');
    });

    it('should handle boolean values correctly', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, active: true, verified: false },
          { id: 2, active: false, verified: true },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should handle null values', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [
          { id: 1, name: 'Test', email: null },
          { id: 2, name: null, email: 'test@example.com' },
        ],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should use custom delimiter when provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          delimiter: ';',
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should use custom quote character when provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          quote: "'",
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should use custom encoding when provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          encoding: 'utf8',
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should use headers when provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test', email: 'test@example.com' }],
        options: {
          headers: ['id', 'name'],
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
      const csvContent = result.data.toString('utf-8');
      expect(csvContent).toContain('id');
      expect(csvContent).toContain('name');
    });

    it('should use headersMap when provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
        options: {
          headersMap: { id: 'ID', name: 'Name' },
        },
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should use default encoding when not provided', async () => {
      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: [{ id: 1, name: 'Test' }],
      };
      const result: DataExportResult =
        await service.exportAsync(dataExportArgs);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
      expect(result.extension).toBe('csv');
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should export using paginated loader with offset when nextCursor is absent', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Row ${i + 1}`,
      }));
      const page2 = [{ id: 101, name: 'Row 101' }];

      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((args: PaginationArgs): Promise<LoaderResult> => {
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

      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: loader,
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(loader).toHaveBeenCalledTimes(2);
      expect(result.data).toBeInstanceOf(Buffer);
      const csv = result.data.toString('utf-8');
      expect(csv).toContain('id');
      expect(csv).toContain('name');
      expect(csv).toContain('101');
      const lines = csv.split(/\r?\n/).filter((line) => line.length > 0);
      const headerLines = lines.filter(
        (line) =>
          line.includes('id') && line.includes('name') && /^id[,;]/.test(line),
      );
      expect(headerLines.length).toBe(1);
    });

    it('should export using paginated loader with nextCursor when present', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
      }));
      const page2 = [{ id: 101 }];

      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((args: PaginationArgs): Promise<LoaderResult> => {
        if (args.nextCursor === undefined) {
          expect(args.offset).toBe(0);
          expect(args.limit).toBe(100);
          return Promise.resolve({ data: page1, nextCursor: 'next-page' });
        }
        expect(args.nextCursor).toBe('next-page');
        expect(args.offset).toBeUndefined();
        return Promise.resolve({ data: page2 });
      });

      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: loader,
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(loader).toHaveBeenCalledTimes(2);
      const csv = result.data.toString('utf-8');
      expect(csv).toContain('101');
    });

    it('should apply options.headers when data comes from paginated loader', async () => {
      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((): Promise<LoaderResult> => {
        return Promise.resolve({
          data: [{ id: 1, name: 'A', extra: 'x' }],
        });
      });

      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: loader,
        options: {
          headers: ['id', 'name'],
        },
      };
      const result = await service.exportAsync(dataExportArgs);

      const csv = result.data.toString('utf-8');
      expect(csv).toContain('id');
      expect(csv).toContain('name');
      expect(csv).toContain('1');
      expect(csv).toContain('A');
      expect(csv).not.toContain('extra');
    });

    it('should return empty buffer when paginated loader returns empty first page', async () => {
      type LoaderResult = { data: Array<object>; nextCursor?: string };

      const loader = jest.fn((): Promise<LoaderResult> => {
        return Promise.resolve({ data: [] });
      });

      const dataExportArgs: CsvDataExportArgs = {
        type: DataExporterType.CSV,
        data: loader,
      };
      const result = await service.exportAsync(dataExportArgs);

      expect(loader).toHaveBeenCalledTimes(1);
      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.data.length).toBe(0);
    });
  });
});

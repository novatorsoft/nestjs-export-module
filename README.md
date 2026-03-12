<p align="center">
  <a href="https://novatorsoft.com" target="_blank">
    <img src="https://os.novatorsoft.com/novatorsoft/dark-logo.png" width="700" alt="Novatorsoft Logo"/>
  </a>
</p>

<h1 align="center">NestJS Export Module</h1>
<p align="center">
  A NestJS export module that provides a provider-based abstraction for generating and handling data exports in different formats.
</p>

<p align="center">
  <a href="https://sonarcloud.io/summary/overall?id=novatorsoft_nestjs-export-module" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=novatorsoft_nestjs-export-module&metric=alert_status"/></a>
  <a href="https://sonarcloud.io/summary/overall?id=novatorsoft_nestjs-export-module" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=novatorsoft_nestjs-export-module&metric=coverage"/></a>
  <a href="https://www.npmjs.com/package/nestjs-export-module" target="_blank"><img src="https://img.shields.io/npm/v/nestjs-export-module.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/nestjs-export-module" target="_blank"><img src="https://img.shields.io/npm/l/nestjs-export-module.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/nestjs-export-module" target="_blank"><img src="https://img.shields.io/npm/dm/nestjs-export-module.svg" alt="NPM Downloads" /></a>
</p>

<p align="center">
  <a href="https://www.instagram.com/novatorsoft/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
  <a href="https://www.linkedin.com/company/novatorsoft/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</p>

## About

**NestJS Export Module** helps you standardize export flows by exposing a single `DataExporterService` API while keeping provider-specific details (such as file format, transformation rules, and output options) configurable.

This package currently ships with the following export providers:

- **CSV** (`DataExporterType.CSV`) via `json-2-csv`
- **Excel** (`DataExporterType.EXCEL`) via `exceljs`

## Documentation

For installation, usage, configuration, and examples, see the documentation:

- <https://opensource.novatorsoft.com/docs/nestjs-export-module/intro>

## Installation

```bash
npm i nestjs-export-module
# or
yarn add nestjs-export-module
# or
pnpm add nestjs-export-module
```

> Note: This module relies on `exceljs` and `json-2-csv`. They are listed as dependencies/peerDependencies; ensure your package manager resolves them correctly.

## Quick Start

### 1) Import the module

```ts
import { Module } from '@nestjs/common';
import { DataExporterModule } from 'nestjs-export-module';

@Module({
  imports: [DataExporterModule],
})
export class AppModule {}
```

### 2) Inject and use `DataExporterService`

```ts
import { Injectable } from '@nestjs/common';
import {
  DataExporterService,
  DataExporterType,
} from 'nestjs-export-module';

@Injectable()
export class ReportsService {
  constructor(private readonly dataExporter: DataExporterService) {}

  async exportUsersAsCsv() {
    const result = await this.dataExporter.exportAsync({
      type: DataExporterType.CSV,
      data: [
        { id: 1, name: 'Ada' },
        { id: 2, name: 'Alan' },
      ],
      options: {
        headers: ['id', 'name'],
        headersMap: { id: 'User ID', name: 'Name' },
        delimiter: ',',
        encoding: 'utf-8',
      },
    });

    // result: { mimeType, extension, data: Buffer }
    return result;
  }
}
```

## API

### `DataExporterService`

- `exportAsync(args: DataExportArgs): Promise<DataExportResult>`

### `DataExportResult`

```ts
export class DataExportResult {
  mimeType: string;
  extension: string;
  data: Buffer;
}
```

### Export types

```ts
export enum DataExporterType {
  CSV = 'csv',
  EXCEL = 'excel',
}
```

## Provider options

### CSV options

```ts
{
  headers?: string[];
  headersMap?: Record<string, string>;
  delimiter?: string;
  quote?: string;
  encoding?: BufferEncoding;
}
```

### Excel options

```ts
{
  headers?: string[];
  headersMap?: Record<string, string>;
  sheetName?: string;
  columnOptions?: Record<
    string,
    {
      width?: number;
      style?: {
        numFmt?: string;
      };
    }
  >;
}
```

## Handling the exported result (example)

In a typical HTTP endpoint you may want to return a downloadable file:

```ts
import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('users.csv')
  async usersCsv(@Res() res: Response) {
    const file = await this.reportsService.exportUsersAsCsv();

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="users.${file.extension}"`,
    );

    return res.send(file.data);
  }
}
```

## Extending / adding new providers

This module uses `nestjs-factory-pattern-module` under the hood. To add a new exporter, create a class that extends `DataExporterBaseService` and register it as a factory provider.

High-level steps:

1. Create a new exporter service that extends `DataExporterBaseService`
2. Decorate it with `@FactoryProvider(DATA_EXPORTER_FACTORY_TOKEN, 'your-type')`
3. Add it to the `providers` array of `DataExporterModule`

(We can document a full example once a third provider is added.)

## License

MIT — see [LICENSE](./LICENSE).

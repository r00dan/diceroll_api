import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions } from 'typeorm';

export function NullableColumn(options?: Omit<ColumnOptions, 'nullable'>) {
  return applyDecorators(Column({ nullable: true, ...options }));
}

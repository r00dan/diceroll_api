import { DynamicModule, Module } from '@nestjs/common';

import { NatsService } from './nats.service';
import { NatsConfig } from './nats.config';

@Module({
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {
  static forRoot(config: NatsConfig): DynamicModule {
    const configProvider = {
      provide: 'NATS_CONFIG',
      useValue: { ...config },
    };

    return {
      module: NatsModule,
      providers: [NatsService, configProvider],
      exports: [NatsService],
    };
  }
}

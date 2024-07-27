import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { JSONCodec, NatsConnection, RequestOptions, connect } from 'nats';

import { NatsConfig } from './nats.config';

type Subject = string;

@Injectable()
export class NatsService<S = Subject> implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;

  constructor(@Inject('NATS_CONFIG') private config: NatsConfig) {}

  public async onModuleInit() {
    this.connect();
  }

  public async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  public async publish<T>(subject: S, data: T) {
    const codec = JSONCodec();
    this.connection.publish(subject as string, codec.encode(data));
  }

  public async subscribe(
    subject: S,
    handler: (data: unknown) => Promise<void>,
  ) {
    await this.reconnectIfNeeded();
    const codec = JSONCodec();
    const sub = this.connection.subscribe(subject as string);

    (async () => {
      for await (const msg of sub) {
        const decodedData = codec.decode(msg.data);
        await handler(decodedData);
      }
    })().then();
  }

  public async request<T, Y>(
    subject: S,
    data: T,
    timeout: number = 1000,
  ): Promise<Y> {
    const codec = JSONCodec();
    const requestOptions: RequestOptions = { timeout };

    const msg = await this.connection.request(
      subject as string,
      codec.encode(data),
      requestOptions,
    );

    return codec.decode(msg.data) as Y;
  }

  public async reply(subject: S, handler: (data: any) => any) {
    const codec = JSONCodec();

    await this.reconnectIfNeeded();
    this.connection.subscribe(subject as string, {
      callback: async (err, msg) => {
        if (err) {
          console.error(err);
          return;
        }
        const requestData = codec.decode(msg.data);
        const responseData = await handler(requestData);

        msg.respond(codec.encode(responseData));
      },
    });
  }

  private async connect() {
    this.connection = await connect({ ...this.config });
  }

  private async reconnectIfNeeded() {
    if (!this.connection) {
      await this.connect();
    }
  }
}

import { Repository } from 'typeorm';
import { AbstractRepo } from '../abstract/repo';

export class Repo<T> implements AbstractRepo<T> {
  private repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  public async findOne(id: string | number): Promise<T> {
    return new Promise(() => {});
  }

  public find(): Promise<T[]> {
    return new Promise(() => []);
  }

  public saveOne(entity: Partial<T>): void {}

  public save(entities: Partial<T>[]): void {}

  public deleteOne(id: string | number): void {}
}

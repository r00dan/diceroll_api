type ID = string | number;

export abstract class AbstractRepo<T> {
  public abstract findOne(id: ID): Promise<T>;
  public abstract find(): Promise<Array<T>>;
  public abstract saveOne(entity: Partial<T>): void;
  public abstract save(entities: Array<Partial<T>>): void;
  public abstract deleteOne(id: ID): void;
}

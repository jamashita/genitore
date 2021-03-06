import { UnimplementedError } from '@jamashita/anden-error';
import { ValueObject } from '@jamashita/anden-object';
import { DeadConstructor, Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISuperposition } from '../ISuperposition';

export class MockSuperposition<out A, out D extends Error> extends ValueObject implements ISuperposition<A, D> {
  public constructor() {
    super();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public get(): Promise<Exclude<A, Error>> {
    throw new UnimplementedError();
  }

  public getErrors(): Set<DeadConstructor<D>> {
    throw new UnimplementedError();
  }

  public ifAlive(): this {
    throw new UnimplementedError();
  }

  public ifContradiction(): this {
    throw new UnimplementedError();
  }

  public ifDead(): this {
    throw new UnimplementedError();
  }

  public map<B = A, E extends Error = D>(): ISuperposition<B, D | E> {
    throw new UnimplementedError();
  }

  public pass(): this {
    throw new UnimplementedError();
  }

  public peek(): this {
    throw new UnimplementedError();
  }

  public recover<B = A, E extends Error = D>(): ISuperposition<A | B, E> {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    throw new UnimplementedError();
  }

  public transform<B = A, E extends Error = D>(): ISuperposition<B, E> {
    throw new UnimplementedError();
  }
}

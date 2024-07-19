import { UnimplementedError } from '@jamashita/anden/error';
import type { Schrodinger } from '../../schrodinger/index.js';
import type { ISuperposition } from '../ISuperposition.js';

export class MockSuperposition<out A, out D> implements ISuperposition<A, D> {
  public get(): Promise<A> {
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

  public map<B = A, E = D>(): ISuperposition<B, D | E> {
    throw new UnimplementedError();
  }

  public pass(): this {
    throw new UnimplementedError();
  }

  public peek(): this {
    throw new UnimplementedError();
  }

  public recover<B = A, E = D>(): ISuperposition<A | B, E> {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    throw new UnimplementedError();
  }

  public transform<B = A, E = D>(): ISuperposition<B, E> {
    throw new UnimplementedError();
  }
}

import { UnimplementedError } from '@jamashita/anden-error';
import { ValueObject } from '@jamashita/anden-object';
import { IUnscharferelation } from '../../../unscharferelation/src/Interface/IUnscharferelation';
import { SuperpositionError } from '../Error/SuperpositionError';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Detoxicated } from '../Interface/Detoxicated';
import { ISuperposition } from '../Interface/ISuperposition';
import { Schrodinger } from '../Schrodinger/Schrodinger';

export class MockSuperposition<A, D extends Error> extends ValueObject<'MockSuperposition'> implements ISuperposition<A, D, 'MockSuperposition'> {
  public readonly noun: 'MockSuperposition' = 'MockSuperposition';

  public constructor() {
    super();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public get(): Promise<Detoxicated<A>> {
    throw new UnimplementedError();
  }

  public getErrors(): Set<DeadConstructor<D>> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    throw new UnimplementedError();
  }

  public ifAlive(): this {
    throw new UnimplementedError();
  }

  public ifDead(): this {
    throw new UnimplementedError();
  }

  public ifContradiction(): this {
    throw new UnimplementedError();
  }

  public filter(): ISuperposition<A, D | SuperpositionError> {
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

  public transform<B = A, E extends Error = D>(): ISuperposition<B, E> {
    throw new UnimplementedError();
  }

  public toUnscharferelation(): IUnscharferelation<A> {
    throw new UnimplementedError();
  }
}

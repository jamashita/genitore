import { UnimplementedError } from '@jamashita/anden-error';
import { ValueObject } from '@jamashita/anden-object';
import { ISuperposition } from '../../superposition/Interface/ISuperposition.js';
import { UnscharferelationError } from '../Error/UnscharferelationError.js';
import { Heisenberg } from '../Heisenberg/Heisenberg.js';
import { IUnscharferelation } from '../Interface/IUnscharferelation.js';
import { Matter } from '../Interface/Matter.js';

export class MockUnscharferelation<P> extends ValueObject<'MockUnscharferelation'> implements IUnscharferelation<P, 'MockUnscharferelation'> {
  public readonly noun: 'MockUnscharferelation' = 'MockUnscharferelation';

  public constructor() {
    super();
  }

  public get(): Promise<Matter<P>> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Heisenberg<P>> {
    throw new UnimplementedError();
  }

  public map<Q = P>(): IUnscharferelation<Q> {
    throw new UnimplementedError();
  }

  public recover<Q = P>(): IUnscharferelation<P | Q> {
    throw new UnimplementedError();
  }

  public ifPresent(): this {
    throw new UnimplementedError();
  }

  public ifAbsent(): this {
    throw new UnimplementedError();
  }

  public ifLost(): this {
    throw new UnimplementedError();
  }

  public pass(): this {
    throw new UnimplementedError();
  }

  public peek(): this {
    throw new UnimplementedError();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public filter(): IUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public toSuperposition(): ISuperposition<P, UnscharferelationError> {
    throw new UnimplementedError();
  }
}

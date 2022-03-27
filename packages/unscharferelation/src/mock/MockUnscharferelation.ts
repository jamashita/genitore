import { UnimplementedError } from '@jamashita/anden-error';
import { ValueObject } from '@jamashita/anden-object';
import { Heisenberg, Matter } from '@jamashita/genitore-heisenberg';
import { IUnscharferelation } from '../IUnscharferelation';

export class MockUnscharferelation<P> extends ValueObject implements IUnscharferelation<P> {

  public constructor() {
    super();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public get(): Promise<Matter<P>> {
    throw new UnimplementedError();
  }

  public ifAbsent(): this {
    throw new UnimplementedError();
  }

  public ifLost(): this {
    throw new UnimplementedError();
  }

  public ifPresent(): this {
    throw new UnimplementedError();
  }

  public map<Q = P>(): IUnscharferelation<Q> {
    throw new UnimplementedError();
  }

  public pass(): this {
    throw new UnimplementedError();
  }

  public peek(): this {
    throw new UnimplementedError();
  }

  public recover<Q = P>(): IUnscharferelation<P | Q> {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Heisenberg<P>> {
    throw new UnimplementedError();
  }
}

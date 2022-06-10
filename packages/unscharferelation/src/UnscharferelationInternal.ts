import { Consumer, Peek, Reject, Resolve, Supplier, UnaryFunction } from '@jamashita/anden-type';
import { Absent, Heisenberg, Lost, Present, Uncertain } from '@jamashita/genitore-heisenberg';
import {
  DestroyPassPlan,
  DestroyPlan,
  MapPassPlan,
  MapPlan,
  Plan,
  RecoveryPassPlan,
  RecoveryPlan,
  SpoilPlan
} from '@jamashita/genitore-plan';
import { Epoque } from './Epoque';
import { IUnscharferelation, UReturnType } from './IUnscharferelation';
import {
  AbsentPlan,
  CombinedEpoquePlan,
  DestroyEpoquePlan,
  MapEpoquePlan,
  PresentPlan,
  RecoveryEpoquePlan
} from './Plan';
import { UnscharferelationError } from './UnscharferelationError';

export class UnscharferelationInternal<out P> implements IUnscharferelation<P>, Epoque<P> {
  private heisenberg: Heisenberg<P>;
  private readonly plans: Set<Plan<P, void>>;

  public static of<P>(func: Consumer<Epoque<P>>): UnscharferelationInternal<P> {
    return new UnscharferelationInternal(func);
  }

  protected constructor(func: Consumer<Epoque<P>>) {
    this.heisenberg = Uncertain.of();
    this.plans = new Set();
    func(this);
  }

  public accept(value: Exclude<P, null | undefined | void>): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Present.of(value);

    this.plans.forEach((plan: MapPlan<P>) => {
      plan.onMap(value);
    });
  }

  public decline(): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Absent.of();

    this.plans.forEach((plan: RecoveryPlan<void>) => {
      plan.onRecover();
    });
  }

  public get(): Promise<Exclude<P, null | undefined | void>> {
    return new Promise((resolve: Resolve<Exclude<P, null | undefined | void>>, reject: Reject) => {
      this.pass(
        (value: Exclude<P, null | undefined | void>) => {
          resolve(value);
        },
        () => {
          reject(new UnscharferelationError('ABSENT'));
        },
        (e: unknown) => {
          reject(e);
        }
      );
    });
  }

  private handle(map: MapPlan<Exclude<P, null | undefined | void>>, recover: RecoveryPlan<void>, destroy: DestroyPlan): unknown {
    if (this.heisenberg.isPresent()) {
      return map.onMap(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return recover.onRecover();
    }
    if (this.heisenberg.isLost()) {
      return destroy.onDestroy(this.heisenberg.getCause());
    }

    return this.plans.add(CombinedEpoquePlan.of<P>(map, recover, destroy));
  }

  public ifAbsent(consumer: Consumer<void>): this {
    this.handle(SpoilPlan.of(), RecoveryPassPlan.of(consumer), SpoilPlan.of());

    return this;
  }

  public ifLost(consumer: Consumer<unknown>): this {
    this.handle(SpoilPlan.of(), SpoilPlan.of(), DestroyPassPlan.of(consumer));

    return this;
  }

  public ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this {
    this.handle(MapPassPlan.of(consumer), SpoilPlan.of(), SpoilPlan.of());

    return this;
  }

  public map<Q = P>(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>): UnscharferelationInternal<Q> {
    return UnscharferelationInternal.of((epoque: Epoque<Q>) => {
      return this.handle(PresentPlan.of(mapper, epoque), RecoveryEpoquePlan.of(epoque), DestroyEpoquePlan.of(epoque));
    });
  }

  public pass(accepted: Consumer<Exclude<P, null | undefined | void>>, declined: Consumer<void>, thrown: Consumer<unknown>): this {
    this.handle(MapPassPlan.of(accepted), RecoveryPassPlan.of(declined), DestroyPassPlan.of(thrown));

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of(peek), RecoveryPassPlan.of(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public recover<Q = P>(mapper: Supplier<UReturnType<Q>>): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<P | Q>) => {
      return this.handle(MapEpoquePlan.of(epoque), AbsentPlan.of(mapper, epoque), DestroyEpoquePlan.of(epoque));
    });
  }

  public serialize(): string {
    return this.heisenberg.toString();
  }

  private settled(): boolean {
    return this.heisenberg.isPresent() || this.heisenberg.isAbsent() || this.heisenberg.isLost();
  }

  public terminate(): Promise<Heisenberg<P>> {
    return new Promise((resolve: Resolve<Heisenberg<P>>) => {
      this.peek(() => {
        resolve(this.heisenberg);
      });
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Lost.of(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      plan.onDestroy(cause);
    });
  }

  public toString(): string {
    return this.serialize();
  }
}

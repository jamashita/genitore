import { Consumer, Peek, Reject, Resolve, Supplier, UnaryFunction } from '@jamashita/anden-type';
import { DestroyPassPlan } from '../plan/DestroyPassPlan.js';
import { DestroySpoilPlan } from '../plan/DestroySpoilPlan.js';
import { DestroyPlan } from '../plan/Interface/DestroyPlan.js';
import { MapPlan } from '../plan/Interface/MapPlan.js';
import { Plan } from '../plan/Interface/Plan.js';
import { RecoveryPlan } from '../plan/Interface/RecoveryPlan.js';
import { MapPassPlan } from '../plan/MapPassPlan.js';
import { MapSpoilPlan } from '../plan/MapSpoilPlan.js';
import { RecoveryPassPlan } from '../plan/RecoveryPassPlan.js';
import { RecoverySpoilPlan } from '../plan/RecoverySpoilPlan.js';
import { Epoque } from './Epoque/Interface/Epoque.js';
import { UnscharferelationError } from './Error/UnscharferelationError.js';
import { Absent } from './Heisenberg/Absent.js';
import { Heisenberg } from './Heisenberg/Heisenberg.js';
import { Lost } from './Heisenberg/Lost.js';
import { Present } from './Heisenberg/Present.js';
import { Uncertain } from './Heisenberg/Uncertain.js';
import { IUnscharferelation, UReturnType } from './Interface/IUnscharferelation.js';
import { Matter } from './Interface/Matter.js';
import { AbsentPlan } from './Plan/AbsentPlan.js';
import { CombinedEpoquePlan } from './Plan/CombinedEpoquePlan.js';
import { DestroyEpoquePlan } from './Plan/DestroyEpoquePlan.js';
import { MapEpoquePlan } from './Plan/MapEpoquePlan.js';
import { PresentPlan } from './Plan/PresentPlan.js';
import { RecoveryEpoquePlan } from './Plan/RecoveryEpoquePlan.js';

export class UnscharferelationInternal<P> implements IUnscharferelation<P, 'UnscharferelationInternal'>, Epoque<P, 'UnscharferelationInternal'> {
  public readonly noun: 'UnscharferelationInternal' = 'UnscharferelationInternal';
  private heisenberg: Heisenberg<P>;
  private readonly plans: Set<Plan<Matter<P>, void>>;

  public static of<PT>(func: UnaryFunction<Epoque<PT>, unknown>): UnscharferelationInternal<PT> {
    return new UnscharferelationInternal<PT>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<P>, unknown>) {
    this.heisenberg = Uncertain.of<P>();
    this.plans = new Set<Plan<Matter<P>, void>>();
    func(this);
  }

  public accept(value: Matter<P>): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Present.of<P>(value);

    this.plans.forEach((plan: MapPlan<Matter<P>>) => {
      return plan.onMap(value);
    });
  }

  public decline(): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Absent.of<P>();

    this.plans.forEach((plan: RecoveryPlan<void>) => {
      return plan.onRecover();
    });
  }

  public get(): Promise<Matter<P>> {
    return new Promise<Matter<P>>((resolve: Resolve<Matter<P>>, reject: Reject<UnscharferelationError | unknown>) => {
      this.pass(
        (value: Matter<P>) => {
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

  public ifAbsent(consumer: Consumer<void>): this {
    this.handle(
      MapSpoilPlan.of<Matter<P>>(),
      RecoveryPassPlan.of<void>(consumer),
      DestroySpoilPlan.of()
    );

    return this;
  }

  public ifLost(consumer: Consumer<unknown>): this {
    this.handle(
      MapSpoilPlan.of<Matter<P>>(),
      RecoverySpoilPlan.of<void>(),
      DestroyPassPlan.of(consumer)
    );

    return this;
  }

  public ifPresent(consumer: Consumer<Matter<P>>): this {
    this.handle(
      MapPassPlan.of<Matter<P>>(consumer),
      RecoverySpoilPlan.of<void>(),
      DestroySpoilPlan.of()
    );

    return this;
  }

  public map<Q = P>(mapper: UnaryFunction<Matter<P>, UReturnType<Q>>): UnscharferelationInternal<Q> {
    return UnscharferelationInternal.of<Q>((epoque: Epoque<Q>) => {
      return this.handle(
        PresentPlan.of<P, Q>(mapper, epoque),
        RecoveryEpoquePlan.of<Q>(epoque),
        DestroyEpoquePlan.of<Q>(epoque)
      );
    });
  }

  public pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): this {
    this.handle(
      MapPassPlan.of<Matter<P>>(accepted),
      RecoveryPassPlan.of<void>(declined),
      DestroyPassPlan.of(thrown)
    );

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of<Matter<P>>(peek), RecoveryPassPlan.of<void>(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public recover<Q = P>(mapper: Supplier<UReturnType<Q>>): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<P | Q>) => {
      return this.handle(
        MapEpoquePlan.of<P | Q>(epoque),
        AbsentPlan.of<Q>(mapper, epoque),
        DestroyEpoquePlan.of<Q>(epoque)
      );
    });
  }

  public terminate(): Promise<Heisenberg<P>> {
    return new Promise<Heisenberg<P>>((resolve: Resolve<Heisenberg<P>>) => {
      this.peek(() => {
        resolve(this.heisenberg);
      });
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Lost.of<P>(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      return plan.onDestroy(cause);
    });
  }

  private handle(map: MapPlan<Matter<P>>, recover: RecoveryPlan<void>, destroy: DestroyPlan): unknown {
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

  public serialize(): string {
    return this.heisenberg.toString();
  }

  private settled(): boolean {
    switch (this.heisenberg.status()) {
      case 'Absent':
      case 'Lost':
      case 'Present': {
        return true;
      }
      case 'Uncertain':
      default: {
        return false;
      }
    }
  }

  public toString(): string {
    return this.serialize();
  }
}

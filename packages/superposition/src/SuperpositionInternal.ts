import { Consumer, Peek, Reject, Resolve, UnaryFunction } from '@jamashita/anden-type';
import {
  DestroyPassPlan,
  DestroyPlan,
  DestroySpoilPlan,
  MapPassPlan,
  MapPlan,
  MapSpoilPlan,
  Plan,
  RecoveryPassPlan,
  RecoveryPlan,
  RecoverySpoilPlan
} from '@jamashita/genitore-plan';
import { Chrono } from './Chrono/Interface/Chrono';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition, SReturnType } from './Interface/ISuperposition';
import { AlivePlan } from './Plan/AlivePlan';
import { CombinedChronoPlan } from './Plan/CombinedChronoPlan';
import { DeadPlan } from './Plan/DeadPlan';
import { DestroyChronoPlan } from './Plan/DestroyChronoPlan';
import { MapChronoPlan } from './Plan/MapChronoPlan';
import { RecoveryChronoPlan } from './Plan/RecoveryChronoPlan';
import { Alive } from './Schrodinger/Alive';
import { Contradiction } from './Schrodinger/Contradiction';
import { Dead } from './Schrodinger/Dead';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { Still } from './Schrodinger/Still';

export class SuperpositionInternal<A, D extends Error> implements ISuperposition<A, D, 'SuperpositionInternal'>, Chrono<A, D> {
  public readonly noun: 'SuperpositionInternal' = 'SuperpositionInternal';
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<Plan<Detoxicated<A>, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<AT, DT extends Error>(func: UnaryFunction<Chrono<AT, DT>, unknown>, errors: Iterable<DeadConstructor<DT>>): SuperpositionInternal<AT, DT> {
    return new SuperpositionInternal<AT, DT>(func, errors);
  }

  protected constructor(func: UnaryFunction<Chrono<A, D>, unknown>, errors: Iterable<DeadConstructor<D>>) {
    this.schrodinger = Still.of<A, D>();
    this.plans = new Set<Plan<A, D>>();
    this.errors = new Set<DeadConstructor<D>>(errors);
    func(this);
  }

  public serialize(): string {
    return this.schrodinger.toString();
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): Promise<Detoxicated<A>> {
    return new Promise<Detoxicated<A>>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D | unknown>) => {
      this.pass(
        (value: Detoxicated<A>) => {
          resolve(value);
        },
        (value: D) => {
          reject(value);
        },
        (e: unknown) => {
          reject(e);
        }
      );
    });
  }

  public getErrors(): Set<DeadConstructor<D>> {
    return new Set<DeadConstructor<D>>(this.errors);
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return new Promise<Schrodinger<A, D>>((resolve: Resolve<Schrodinger<A, D>>) => {
      this.peek(() => {
        resolve(this.schrodinger);
      });
    });
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>((chrono: Chrono<B, D | E>) => {
      return this.handle(
        AlivePlan.of<A, B, D | E>(mapper, chrono),
        RecoveryChronoPlan.of<B, D | E>(chrono),
        DestroyChronoPlan.of<B, D | E>(chrono)
      );
    }, [...this.errors, ...errors]);
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((chrono: Chrono<A | B, E>) => {
      return this.handle(
        MapChronoPlan.of<A | B, E>(chrono),
        DeadPlan.of<B, D, E>(mapper, chrono),
        DestroyChronoPlan.of<A | B, E>(chrono)
      );
    }, errors);
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    dead: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((chrono: Chrono<B, E>) => {
      this.handle(
        AlivePlan.of<A, B, E>(alive, chrono),
        DeadPlan.of<B, D, E>(dead, chrono),
        DestroyChronoPlan.of<A | B, E>(chrono)
      );
    }, errors);
  }

  public ifAlive(consumer: Consumer<Detoxicated<A>>): this {
    this.handle(MapPassPlan.of<Detoxicated<A>>(consumer), RecoverySpoilPlan.of<D>(), DestroySpoilPlan.of());

    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    this.handle(MapSpoilPlan.of<Detoxicated<A>>(), RecoveryPassPlan.of<D>(consumer), DestroySpoilPlan.of());

    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    this.handle(MapSpoilPlan.of<Detoxicated<A>>(), RecoverySpoilPlan.of<D>(), DestroyPassPlan.of(consumer));

    return this;
  }

  public pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.handle(MapPassPlan.of<Detoxicated<A>>(accepted), RecoveryPassPlan.of<D>(declined), DestroyPassPlan.of(thrown));

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of<Detoxicated<A>>(peek), RecoveryPassPlan.of<D>(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public accept(value: Detoxicated<A>): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of<A, D>(value);

    this.plans.forEach((plan: MapPlan<Detoxicated<A>>) => {
      return plan.onMap(value);
    });
  }

  public decline(error: D): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.plans.forEach((plan: RecoveryPlan<D>) => {
      return plan.onRecover(error);
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Contradiction.of<A, D>(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      return plan.onDestroy(cause);
    });
  }

  public catch(errors: Iterable<DeadConstructor<D>>): void {
    [...errors].forEach((error: DeadConstructor<D>) => {
      this.errors.add(error);
    });
  }

  private settled(): boolean {
    switch (this.schrodinger.status()) {
      case 'Alive':
      case 'Contradiction':
      case 'Dead': {
        return true;
      }
      case 'Still':
      default: {
        return false;
      }
    }
  }

  private handle(map: MapPlan<Detoxicated<A>>, recover: RecoveryPlan<D>, destroy: DestroyPlan): unknown {
    if (this.schrodinger.isAlive()) {
      return map.onMap(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return recover.onRecover(this.schrodinger.getError());
    }
    if (this.schrodinger.isContradiction()) {
      return destroy.onDestroy(this.schrodinger.getCause());
    }

    return this.plans.add(CombinedChronoPlan.of<A, D>(map, recover, destroy));
  }
}

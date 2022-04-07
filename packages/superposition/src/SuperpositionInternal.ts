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
import {
  Alive,
  Contradiction,
  Dead,
  DeadConstructor,
  Detoxicated,
  Schrodinger,
  Still
} from '@jamashita/genitore-schrodinger';
import { Chrono } from './Chrono';
import { ISuperposition, SReturnType } from './ISuperposition';
import { AlivePlan, CombinedChronoPlan, DeadPlan, DestroyChronoPlan, MapChronoPlan, RecoveryChronoPlan } from './Plan';

export class SuperpositionInternal<A, D extends Error> implements ISuperposition<A, D>, Chrono<A, D> {
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<Plan<Detoxicated<A>, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<A, D extends Error>(func: UnaryFunction<Chrono<A, D>, unknown>, errors: Iterable<DeadConstructor<D>>): SuperpositionInternal<A, D> {
    return new SuperpositionInternal(func, errors);
  }

  protected constructor(func: UnaryFunction<Chrono<A, D>, unknown>, errors: Iterable<DeadConstructor<D>>) {
    this.schrodinger = Still.of();
    this.plans = new Set();
    this.errors = new Set(errors);
    func(this);
  }

  public accept(value: Detoxicated<A>): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of(value);

    this.plans.forEach((plan: MapPlan<Detoxicated<A>>) => {
      return plan.onMap(value);
    });
  }

  public catch(errors: Iterable<DeadConstructor<D>>): void {
    [...errors].forEach((error: DeadConstructor<D>) => {
      this.errors.add(error);
    });
  }

  public decline(error: D): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Dead.of(error);

    this.plans.forEach((plan: RecoveryPlan<D>) => {
      return plan.onRecover(error);
    });
  }

  public get(): Promise<Detoxicated<A>> {
    return new Promise((resolve: Resolve<Detoxicated<A>>, reject: Reject) => {
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
    return new Set(this.errors);
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

    return this.plans.add(CombinedChronoPlan.of(map, recover, destroy));
  }

  public ifAlive(consumer: Consumer<Detoxicated<A>>): this {
    this.handle(MapPassPlan.of(consumer), RecoverySpoilPlan.of(), DestroySpoilPlan.of());

    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    this.handle(MapSpoilPlan.of(), RecoverySpoilPlan.of(), DestroyPassPlan.of(consumer));

    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    this.handle(MapSpoilPlan.of(), RecoveryPassPlan.of(consumer), DestroySpoilPlan.of());

    return this;
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>((chrono: Chrono<B, D | E>) => {
      return this.handle(AlivePlan.of(mapper, chrono), RecoveryChronoPlan.of(chrono), DestroyChronoPlan.of(chrono));
    }, [...this.errors, ...errors]);
  }

  public pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.handle(MapPassPlan.of(accepted), RecoveryPassPlan.of(declined), DestroyPassPlan.of(thrown));

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of(peek), RecoveryPassPlan.of(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((chrono: Chrono<A | B, E>) => {
      return this.handle(MapChronoPlan.of(chrono), DeadPlan.of(mapper, chrono), DestroyChronoPlan.of(chrono));
    }, errors);
  }

  public serialize(): string {
    return this.schrodinger.toString();
  }

  private settled(): boolean {
    return this.schrodinger instanceof Alive || this.schrodinger instanceof Dead || this.schrodinger instanceof Contradiction;
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return new Promise((resolve: Resolve<Schrodinger<A, D>>) => {
      this.peek(() => {
        resolve(this.schrodinger);
      });
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Contradiction.of(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      return plan.onDestroy(cause);
    });
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    dead: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((chrono: Chrono<B, E>) => {
      this.handle(AlivePlan.of(alive, chrono), DeadPlan.of(dead, chrono), DestroyChronoPlan.of(chrono));
    }, errors);
  }
}

import type { Consumer, Peek, Reject, Resolve, UnaryFunction } from '@jamashita/anden/type';
import {
  DestroyPassPlan,
  type DestroyPlan,
  MapPassPlan,
  type MapPlan,
  type Plan,
  RecoveryPassPlan,
  type RecoveryPlan,
  SpoilPlan
} from '../plan/index.js';
import { Alive, Contradiction, Dead, type DeadConstructor, type Schrodinger, Still } from '../schrodinger/index.js';
import type { Chrono } from './Chrono.js';
import type { ISuperposition, SReturnType } from './ISuperposition.js';
import { AlivePlan, CombinedChronoPlan, DeadPlan, DestroyChronoPlan, MapChronoPlan, RecoveryChronoPlan } from './Plan/index.js';

export class SuperpositionInternal<out A, out D extends Error> implements ISuperposition<A, D>, Chrono<A, D> {
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<Plan<Exclude<A, Error>, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<A, D extends Error>(func: Consumer<Chrono<A, D>>, errors: Iterable<DeadConstructor<D>>): SuperpositionInternal<A, D> {
    return new SuperpositionInternal(func, errors);
  }

  protected constructor(func: Consumer<Chrono<A, D>>, errors: Iterable<DeadConstructor<D>>) {
    this.schrodinger = Still.of();
    this.plans = new Set();
    this.errors = new Set(errors);
    func(this);
  }

  public accept(value: Exclude<A, Error>): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of(value);

    for (const plan of this.plans) {
      plan.onMap(value);
    }
  }

  public catch(errors: Iterable<DeadConstructor<D>>): void {
    for (const error of errors) {
      this.errors.add(error);
    }
  }

  public decline(error: D): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Dead.of(error);

    for (const plan of this.plans) {
      plan.onRecover(error);
    }
  }

  public get(): Promise<Exclude<A, Error>> {
    return new Promise((resolve: Resolve<Exclude<A, Error>>, reject: Reject) => {
      this.pass(
        (value: Exclude<A, Error>) => {
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

  private handle(map: MapPlan<Exclude<A, Error>>, recover: RecoveryPlan<D>, destroy: DestroyPlan): unknown {
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

  public ifAlive(consumer: Consumer<Exclude<A, Error>>): this {
    this.handle(MapPassPlan.of(consumer), SpoilPlan.of(), SpoilPlan.of());

    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    this.handle(SpoilPlan.of(), SpoilPlan.of(), DestroyPassPlan.of(consumer));

    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    this.handle(SpoilPlan.of(), RecoveryPassPlan.of(consumer), SpoilPlan.of());

    return this;
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>(
      (chrono: Chrono<B, D | E>) => {
        return this.handle(AlivePlan.of(mapper, chrono), RecoveryChronoPlan.of(chrono), DestroyChronoPlan.of(chrono));
      },
      [...this.errors, ...errors]
    );
  }

  public pass(accepted: Consumer<Exclude<A, Error>>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.handle(MapPassPlan.of(accepted), RecoveryPassPlan.of(declined), DestroyPassPlan.of(thrown));

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of(peek), RecoveryPassPlan.of(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of((chrono: Chrono<A | B, E>) => {
      return this.handle(MapChronoPlan.of(chrono), DeadPlan.of(mapper, chrono), DestroyChronoPlan.of(chrono));
    }, errors);
  }

  public serialize(): string {
    return this.schrodinger.toString();
  }

  private settled(): boolean {
    return this.schrodinger.isAlive() || this.schrodinger.isDead() || this.schrodinger.isContradiction();
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

    for (const plan of this.plans) {
      plan.onDestroy(cause);
    }
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>,
    dead: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of((chrono: Chrono<B, E>) => {
      this.handle(AlivePlan.of(alive, chrono), DeadPlan.of(dead, chrono), DestroyChronoPlan.of(chrono));
    }, errors);
  }
}

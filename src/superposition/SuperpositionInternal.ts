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
import { Alive, Contradiction, Dead, type Schrodinger, Still } from '../schrodinger/index.js';
import type { Chrono } from './Chrono.js';
import type { ISuperposition, SReturnType } from './ISuperposition.js';
import { AlivePlan, CombinedChronoPlan, DeadPlan, DestroyChronoPlan, MapChronoPlan, RecoveryChronoPlan } from './Plan/index.js';

export class SuperpositionInternal<out A, out D> implements ISuperposition<A, D>, Chrono<A, D> {
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<Plan<A, D>>;

  public static of<A, D>(func: Consumer<Chrono<A, D>>): SuperpositionInternal<A, D> {
    return new SuperpositionInternal(func);
  }

  protected constructor(func: Consumer<Chrono<A, D>>) {
    this.schrodinger = Still.of();
    this.plans = new Set();
    func(this);
  }

  public accept(value: A): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of(value);

    for (const plan of this.plans) {
      plan.onMap(value);
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

  public get(): Promise<A> {
    return new Promise((resolve: Resolve<A>, reject: Reject) => {
      this.pass(
        (value: A) => {
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

  private handle(map: MapPlan<A>, recover: RecoveryPlan<D>, destroy: DestroyPlan): unknown {
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

  public ifAlive(consumer: Consumer<A>): this {
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

  public map<B = A, E = D>(mapper: UnaryFunction<A, SReturnType<B, E>>): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>((chrono: Chrono<B, D | E>) => {
      return this.handle(AlivePlan.of(mapper, chrono), RecoveryChronoPlan.of(chrono), DestroyChronoPlan.of(chrono));
    });
  }

  public pass(accepted: Consumer<A>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.handle(MapPassPlan.of(accepted), RecoveryPassPlan.of(declined), DestroyPassPlan.of(thrown));

    return this;
  }

  public peek(peek: Peek): this {
    this.handle(MapPassPlan.of(peek), RecoveryPassPlan.of(peek), DestroyPassPlan.of(peek));

    return this;
  }

  public recover<B = A, E = D>(mapper: UnaryFunction<D, SReturnType<B, E>>): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of((chrono: Chrono<A | B, E>) => {
      return this.handle(MapChronoPlan.of(chrono), DeadPlan.of(mapper, chrono), DestroyChronoPlan.of(chrono));
    });
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

  public transform<B = A, E = D>(alive: UnaryFunction<A, SReturnType<B, E>>, dead: UnaryFunction<D, SReturnType<B, E>>): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of((chrono: Chrono<B, E>) => {
      this.handle(AlivePlan.of(alive, chrono), DeadPlan.of(dead, chrono), DestroyChronoPlan.of(chrono));
    });
  }
}

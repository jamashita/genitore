import { Objet } from '@jamashita/anden-object';
import { Consumer, Kind, Peek, Predicate, Reject, Resolve, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { DestroyPassPlan } from '../../plan/src/DestroyPassPlan';
import { DestroySpoilPlan } from '../../plan/src/DestroySpoilPlan';
import { DestroyPlan } from '../../plan/src/Interface/DestroyPlan';
import { MapPlan } from '../../plan/src/Interface/MapPlan';
import { Plan } from '../../plan/src/Interface/Plan';
import { RecoveryPlan } from '../../plan/src/Interface/RecoveryPlan';
import { MapPassPlan } from '../../plan/src/MapPassPlan';
import { MapSpoilPlan } from '../../plan/src/MapSpoilPlan';
import { RecoveryPassPlan } from '../../plan/src/RecoveryPassPlan';
import { RecoverySpoilPlan } from '../../plan/src/RecoverySpoilPlan';
import { Epoque } from '../../unscharferelation/src/Epoque/Interface/Epoque';
import { Matter } from '../../unscharferelation/src/Interface/Matter';
import { UnscharferelationInternal } from '../../unscharferelation/src/UnscharferelationInternal';
import { Chrono } from './Chrono/Interface/Chrono';
import { SuperpositionError } from './Error/SuperpositionError';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition } from './Interface/ISuperposition';
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

export class SuperpositionInternal<A, D extends Error> extends Objet<'SuperpositionInternal'>
  implements ISuperposition<A, D, 'SuperpositionInternal'>, Chrono<A, D> {
  public readonly noun: 'SuperpositionInternal' = 'SuperpositionInternal';
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<Plan<Detoxicated<A>, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<AT, DT extends Error>(func: UnaryFunction<Chrono<AT, DT>, unknown>, errors: Iterable<DeadConstructor<DT>>): SuperpositionInternal<AT, DT> {
    return new SuperpositionInternal<AT, DT>(func, errors);
  }

  protected constructor(func: UnaryFunction<Chrono<A, D>, unknown>, errors: Iterable<DeadConstructor<D>>) {
    super();
    this.schrodinger = Still.of<A, D>();
    this.plans = new Set<Plan<A, D>>();
    this.errors = new Set<DeadConstructor<D>>(errors);
    func(this);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof SuperpositionInternal)) {
      return false;
    }

    return this.schrodinger.equals(other.schrodinger);
  }

  public serialize(): string {
    return this.schrodinger.toString();
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

  public filter(predicate: Predicate<A>): SuperpositionInternal<A, D | SuperpositionError> {
    return SuperpositionInternal.of<A, D | SuperpositionError>(
      (chrono: Chrono<A, D | SuperpositionError>) => {
        this.pass(
          (value: Detoxicated<A>) => {
            if (predicate(value)) {
              return chrono.accept(value);
            }

            return chrono.decline(new SuperpositionError('DEAD'));
          },
          (value: D) => {
            return chrono.decline(value);
          },
          (e: unknown) => {
            return chrono.throw(e);
          }
        );
      }, [...this.errors, SuperpositionError]
    );
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SyncAsync<Detoxicated<B> | SuperpositionInternal<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
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
    mapper: UnaryFunction<D, SyncAsync<Detoxicated<B> | SuperpositionInternal<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
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
    alive: UnaryFunction<Detoxicated<A>, SyncAsync<Detoxicated<B> | SuperpositionInternal<B, E>>>,
    dead: UnaryFunction<D, SyncAsync<Detoxicated<B> | SuperpositionInternal<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
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

  public toUnscharferelation(): UnscharferelationInternal<A> {
    return UnscharferelationInternal.of<A>((epoque: Epoque<A>) => {
      this.pass(
        (v: Detoxicated<A>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            return epoque.decline();
          }

          return epoque.accept((v as unknown) as Matter<A>);
        },
        () => {
          return epoque.decline();
        },
        (e: unknown) => {
          return epoque.throw(e);
        }
      );
    });
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
    return this.schrodinger.isAlive() || this.schrodinger.isDead() || this.schrodinger.isContradiction();
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

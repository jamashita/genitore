import type { Plan } from './Plan.js';

export class SpoilPlan<out M, out R> implements Plan<M, R> {
  private static readonly INSTANCE: SpoilPlan<unknown, unknown> = new SpoilPlan();

  public static of<M, R>(): SpoilPlan<M, R> {
    return SpoilPlan.INSTANCE as SpoilPlan<M, R>;
  }

  protected constructor() {
    // NOOP
  }

  public onDestroy(): void {
    // NOOP
  }

  public onMap(): void {
    // NOOP
  }

  public onRecover(): void {
    // NOOP
  }
}

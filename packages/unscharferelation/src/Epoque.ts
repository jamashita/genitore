export interface Epoque<out M> {
  accept(value: Exclude<M, null | undefined | void>): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}

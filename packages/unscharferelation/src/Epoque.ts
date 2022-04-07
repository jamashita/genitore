export interface Epoque<M> {
  accept(value: M): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}

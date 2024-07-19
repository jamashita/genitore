export interface Chrono<out M, out R> {
  accept(value: M): unknown;

  decline(value: R): unknown;

  throw(cause: unknown): unknown;
}

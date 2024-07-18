export interface Chrono<out M, out R extends Error> {
  accept(value: Exclude<M, Error>): unknown;

  decline(value: R): unknown;

  throw(cause: unknown): unknown;
}

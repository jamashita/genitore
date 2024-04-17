export interface Epoque<out M> {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  accept(value: Exclude<M, null | undefined | void>): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}

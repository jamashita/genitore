# Genitore

This package contains Optional monad and Result monad that support asynchronously.

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CI](https://github.com/jamashita/genitore/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/jamashita/genitore/actions/workflows/ci.yml)

## Requisite

```
> node -v
v18.9.1

> npm -v
8.19.1

> yarn -v
1.22.19
```

## Conventional commit

```
git cz
```

# Heisenberg classes

## Absent<P>

A class that represents the fulfilled state for `Heisenberg`, but with the absence of a value. It means the value is
`null` or `undefined`. It is equivalent to None for Optional types and it implements `Heisenberg` interface.

## Lost<P>

A class that represents the rejected state for `Heisenberg`. This class contains an exception for the operation that
occurred. It implements `Heisenberg` interface.

## Present<P>

A class that represents the fulfilled state for `Heisenberg`. This class contains a value of type `P` that cannot be
`null` or `undefined`. It is equivalent to Some for Optional types. It implements `Heisenberg` interface.

## Uncertain<P>

A class that represents the pending state for `Heisenberg`. It implements `Heisenberg` interface.

## (interface) Heisenberg\<P\>

This interface represents an Optional of Monad programming. The common interface
for `Absent<P>`, `Lost<P>`, `Present<P>` and `Uncertain<V>`. This interface provides common methods for the value
presence and absence. `P` represents the type of the data.

### `Heisenberg.all<P>(heisenbergs: Iterable<Heisenberg<P>>): Heisenberg<Array<P>>`

Takes an `Iterable<Heisenberg<P>>` and returns a single `Heisenberg<Array<P>>`. Returns `Present<Array<P>>` when
all `heisenbergs` are in the `Present` state, returns `Absent<Array<P>>` when at least one of `heisenbergs` is in
the `Absent` state, and returns `Lost<Array<A>>` when at least one of `heisenbergs` is in the `Lost`state. If there are
both `Absent` and `Lost` states present in the `heisenbergs`, the return value will be `Lost<Array<P>>` (prioritized).

### `heisenberg.get(): Exclude<P, null | undefined | void>`

Retrieves the retained value. If this instance is `Present`, the returned value will be a non-null, non-undefined value
of type `P`. If this instance is `Absent` or `Uncertain`, `HeisenbergError` will be thrown. If this instance is `Lost`,
the retained `cause` will be thrown.

### `heisenberg.getState(): HeisenbergState`

Returns the current state. The state can be one of the following statuses: `'ABSENT'`, `'LOST'`, `'PRESENT'`
or `'UNCERTAIN'`.

### `heisenberg.ifAbsent(consumer: Consumer<void>): this`

Executes the given `consumer` if this class instance is the `Absent` state.

### `heisenberg.ifLost(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if this class instance is in the `Lost`
state.

### `heisenberg.ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this`

Executes the given `consumer` with the internal non-null, non-undefined value of `P` type if this class instance
is in the `Present` state.

### `heisenberg.isAbsent(): this is Absent<P>`

Returns `true` if this class instance is in the `Absent` state, `false` otherwise.

### `heisenberg.isLost(): this is Lost<P>`

Returns `true` if this class instance is in the `Lost` state, `false` otherwise.

### `heisenberg.isPresent(): this is Present<P>`

Returns `true` if this class instance is in the `Present` state, `false` otherwise.

# Schrodinger classes

## Alive<A, D>

A class that represents the fulfilled state for `Schrodinger`. This class contains a value of type `A` that cannot be
`Error`. It is equivalent to Success for Result types. It implements `Schrodinger` class.

## Contradiction<A, D>

A class that represents the rejected state for `Schrodinger`. This class contains an exception for the operation that
occurred. It implements `Schrodinger` interface.

## Dead<A, D>

A class that represents the fulfilled state for `Heisenberg`. This class contains a value of type `P` that cannot be
`null` or `undefined`. It is equivalent to Some for Option types.

A class that represents the fulfilled state for `Schrodinger`, but with an intended error. It is equivalent to Failure
for Result types and it implements `Schrodinger` interface.

## Uncertain<P>

A class that represents the pending state for `Schrodinger`. It implements `Schrodinger` interface.

## (interface) Schrodinger\<A, D extends Error\>

This interface represents an Result of Monad programming. The common interface
for `Alive<A, D>`, `Contradiction<A, D>`, `Dead<A, D>` and `Still<A, D>`. This interface provides common methods for
success and failure. `A` represents the type of the data and `D` represents the type of the error that may be thrown.

### `Schrodinger.all<A, D extends Error>(schrodingers: Iterable<Schrodinger<A, D>>): Schrodinger<Array<A>, D>`

Takes an `Iterable<Schrodinger<A, D>>` and returns a single `Schrodinger<Array<A>, D>`. Returns `Alive<Array<A>, D>`
when all `schrodingers` are in the `Alive` state, returns `Dead<Array<A>, D>` when at least one of `schrodingers` is in
the `Dead` state, and returns `Contradiction<Array<A>, D>` when at least one of `schrodingers` is in the `Contradiction`
state. If there are both `Dead` and `Contradiction` states present in the `schrodingers`, the return value will
be `Contradiction<Array<A>, D>` (prioritized).

### `schrodinger.get(): Exclude<A, Error>`

Returns the retained value, the returned value cannot be `Error`.

Retrieves the retained value. If this instance is `Alive`, the returned value will be a non-error value of type `A`. If
this instance is `Dead`, the retained error will be thrown. If this instance is `Contradiction`, the retained `cause`
will be thrown. If this instance is `Still`, `SchrodingerError` will be thrown.

### `schrodinger.getState(): SchrodingerState`

Returns the current state. The state can be one of the following statuses: `'ALIVE'`, `'CONTRADICTION'`, `'DEAD'`
or `'STILL'`.

### `schrodinger.ifAlive(consumer: Consumer<Exclude<A, Error>>): this`

Executes the given `consumer` with the non-error value of `A` type if this class instance is in the `Alive` state.

### `schrodinger.ifContradiction(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if this class instance is in
the `Contradiction` state.

### `schrodinger.ifDead(consumer: Consumer<D>): this`

Executes the given `consumer` with the error value of `D` type if this class instance is in the `Dead` state.

### `schrodinger.isAlive(): this is Alive<A, D>`

Returns `true` if this class instance is in the `Alive` state, `false` otherwise.

### `schrodinger.isContradiction(): this is Contradiction<A, D>`

Returns `true` if this class instance is in the `Contradiction` state, `false` otherwise.

### `schrodinger.isDead(): this is Dead<A, D>`

Returns `true` if this class instance is in the `Dead` state, `false` otherwise.

# Superposition classes

## (interface) Chrono<M, R>

### `chrono.accept(valye: Exclude<M, Error>): unknown`

### `chrono.catch(errors: Iterable<DeadConstructor<R>>): void`

### `chrono.decline(value: R): unknown`

### `chrono.getErrors(): Set<DeadConstructor<R>>`

### `chrono.throw(cause: unknown): unknown`

## Superposition\<A, D extends Error\>

A class that handles Result of Monad programming asynchronously. This class wraps a `Schrodinger` instance and changes
its state based on the outcome of an asynchronous operation.

### `Superposition.all<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D>`

Takes an `Iterable<Superposition<A, D>>` and returns a single `Superposition<Array<A>, D>`. If all `superpositions` are
in the `Alive` state, the returned instance will be successfully fulfilled with an array of the values from the
`superpositions`. If at least one of `superpositions` is in the `Dead` state, the returned instance will be
unsuccessfully fulfilled with the error from the first `Dead` state encountered. If at least one of `superpositions` is
in the `Contradiction` state, the returned instance will be rejected with the cause from the first `Contradiction` state
encountered. If there are both `Dead` and `Contradiction` states present in the `superpositions`, the returned instance
will be rejected (prioritized).

### `Superposition.anyway<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>>`

Retrieves the outcome of each asynchronous operation in `superpositions` by calling `superposition.terminate()` on each
item. The resulting `Schrodinger` state for each `Superposition` can be found in the documentation
for `superposition.terminate()`.

### `Superposition.of<A, D extends Error>(func: Consumer<Chrono<Sync<A>, D>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D>`

Generates a new `Superposition` instance by invoking the provided `func` argument with a `Chrono` object. The
`Sync<A>` type represents either a value of type `A` or a `PromiseLike<A>`. If the `chrono.accept(value)` is called with
a valid value of `Sync<A>` type, it returns a successfully fulfilled `Superposition<A, D>`. If
the `chrono.decline(error)` is called with an error of type `D` that is specified in the `errors` argument, it returns
an unsuccessfully fulfilled `Superposition<A, D>`. If the `chrono.throw(cause)` is called with an argument of `unknown`
type, it returns a rejected `Superposition<A, D>`.

```ts
// let value is type of A or PromiseLike<A>
Superposition.of<A, D>((chrono: Chrono<Sync<A>, D>) => {
  try {
    if (value.isValid()) {
      chrono.accept(value);

      return;
    }

    chrono.decline(value.error);
  }
  catch (e: unknown) {
    if (e instanceof RuntimeError) {
      chrono.decline(e);

      return;
    }

    chrono.throw(e);
  }
}, RuntimeError);
```

### `Superposition.ofSchrodinger<A, D extends Error>(schrodinger: Schrodinger<Sync<A>, D>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D>`

Creates a new `Superposition` instance from a given `Schrodinger` instance. The `Sync<A>` type represents a value of
type `A` or a `PromiseLike<A>`. The `errors` parameter is an array of error constructors that can be thrown by the
asynchronous operation. If the given `schrodinger` is in the `Alive` state, the resulting `Superposition` will be
successfully fulfilled. If it is in the `Dead` state, it will be unsuccessfully fulfilled. If it is in
the `Contradiction`or `Still`state, it will be rejected.

### `Superposition.ofSuperposition<A, D extends Error>(superposition: ISuperposition<A, D>): Superposition<A, D>`

Generates a new `Superposition` instance from a given `Superposition` instance.

### `Superposition.playground<A, D extends Error>(supplier: Supplier<Exclude<A, Error> | PromiseLike<Exclude<A, Error>>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D>`

Creates a new `Superposition` instance by executing the provided `supplier`. If the function returns a value of type `A`
or a fulfilled `PromiseLike<A>`, the resulting `Superposition` will be successfully fulfilled. If the function
throws an error or returns a rejected `PromiseLike<A>`, but the error is of a type specified in the `errors` argument,
the resulting `Superposition` will be unsuccessfully fulfilled. If the error is not of a type specified in the `errors`
argument, the resulting `Superposition` will be rejected.

### `superposition.get(): Promise<Exclude<A, Error>>`

Retrieves the outcome of the asynchronous operation as a `Promise`. If the instance is in the successfully fulfilled
state, it will return a fulfilled `Promise` instance. If the instance is in the unsuccessfully fulfilled or rejected
state, it will return a rejected `Promise` instance.

### `superposition.getErrors(): Set<DeadConstructor<D>>`

Returns a set of error constructors that can be thrown by the asynchronous operation.

### `superposition.ifAlive(consumer: Consumer<Exclude<A, Error>>): this`

Executes the given `consumer` with the non-error value of `A` type if the asynchronous operation is going to be
successfully fulfilled.

### `superposition.ifContradiction(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if the asynchronous operation is going
to be rejected.

### `superposition.ifDead(consumer: Consumer<D>): this`

Executes the given `consumer` with the error value of `D` type if the asynchronous operation is going to be
unsuccessfully fulfilled.

### `superposition.map<B = A, E extends Error = D>`(mapper: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, D | E>`

Executes the given `mapper` only when the current instance is in a successfully fulfilled state. The `mapper` should
take in a single argument of type `Exclude<A, Error>` and should return a value of type `B` without an error, or an
instance of `ISuperposition<B, E>`, a `PromiseLike<Exclude<B, Error>>`, or a `PromiseLike<ISuperposition<B, E>>`.
The return value of this method will be a `Superposition<B, E>` instance if the `mapper` is executed and returns a value
or `Superposition<B, E>` without error, otherwise it will return a `Superposition<B, D>` instance if the `mapper` is not
executed or the returned value contain an error. The overall result will be a `Superposition<B, D | E>` instance.

This method can be used as an alternative to `promise.then()`.

```ts
superposition.map<string, SyntaxError>((num: number) => {
  return num.toFixed();
}, SyntaxError).map<number, SyntaxError | TypeError>((str: string) => {
  const num = Number(str);

  if (Number.isNaN(num)) {
    throw new TypeError('NaN');
  }

  return num;
}, TypeError);
```

### `superposition.peek(peek: Peek): this`

Executes the given `peek` with no arguments when the asynchronous operation represented by the current superposition
instance is completed, regardless of whether it is successfully fulfilled, unsuccessfully fulfilled, or rejected. It
allows you to perform side effects, such as logging, without changing the outcome of the operation.

### `superposition.recover<B = A, E extends Error = D>`(mapper: UnaryFunction<D>, SReturnType<B, E>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, D | E>`

Executes the given `mapper` only when the current instance is in an unsuccessfully fulfilled state. The `mapper` should
take in a single argument of type `D` and should return a value of type `B` without an error, or an instance of
`ISuperposition<B, E>`, a `PromiseLike<Exclude<B, Error>>`, or a `PromiseLike<ISuperposition<B, E>>`. The return value
of this method will be a `Superposition<B, E>` instance if the `mapper` is executed and returns a value
or `Superposition<B, E>` without error, otherwise it will return a `Superposition<A, E>` instance if the `mapper` is not
executed or the returned value contains an error. The overall result will be a `Superposition<A | B, E>` instance.

This method can be used as an alternative to `promise.catch()`.

```ts
superposition.map<string, SyntaxError>((num: number) => {
  return num.toFixed();
}, SyntaxError).map<number, SyntaxError | TypeError>((str: string) => {
  const num = Number(str);

  if (Number.isNaN(num)) {
    throw new TypeError('NaN');
  }

  return num;
}, TypeError).recover<number, Error>((e: SyntaxError | TypeError) => {
  logger.error(e);
});
```

### `superposition.terminate(): Promise<Schrodinger<A, D>>`

Terminates the asynchronous operation represented by the current `Superposition` instance and obtain the final state of
the operation represented by a `Schrodinger` instance. If the `Superposition` is successfully fulfilled, the returned
`Schrodinger` will be in the `Alive` state, containing the value of the operation. If the `Superposition` is
unsuccessfully fulfilled, the returned `Schrodinger` will be in the `Dead` state, containing the error that caused the
failure. If the `Superposition` is rejected, the returned `Schrodinger` will be in the `Contradiction` state, indicating
that the operation has been rejected for an unknown reason.

### `superposition.terminate(alive: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>, dead: UnaryFunction<D, SReturnType<B, D>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, E>`

Executes the given `alive` only when the current instance is in a successfully fulfilled state, and also executes the
`dead` only when the current instance is in an unsuccessfully fulfilled state. One of these functions will be executed
unless the current instance is in a rejected state. The overall result will be a `Superposition<B, E>` instance.

This method combines the functionality of `superposition.map()` and `superposition.recover()` into one, allowing you to
handle both successful and unsuccessful outcomes of the asynchronous operation in a single call.

## License

[MIT](LICENSE)
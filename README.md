# Genitore

This package contains Optional monad and Result monad that support asynchronously.

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CI](https://github.com/jamashita/genitore/actions/workflows/ci.yml/badge.svg)](https://github.com/jamashita/genitore/actions/workflows/ci.yml)

## Install

```text
yarn add @jamashita/genitore
```

## Prerequisite

```
> node -v
v20.10.0

> npm -v
10.2.3

> yarn -v
1.22.21
```

## Conventional commit

```
git cz
```

# Heisenberg classes

## Absent\<P\>

A class that represents the fulfilled state for `Heisenberg`, but with the absence of a value. It means the value is
`null` or `undefined`. It is equivalent to None for Optional types and it implements `Heisenberg` interface.

## Lost\<P\>

A class that represents the rejected state for `Heisenberg`. This class contains an exception for the operation that
occurred. It implements `Heisenberg` interface.

## Present\<P\>

A class that represents the fulfilled state for `Heisenberg`. This class contains a value of type `P` that cannot be
`null` or `undefined`. It is equivalent to Some for Optional types. It implements `Heisenberg` interface.

## Uncertain\<P\>

A class that represents the pending state for `Heisenberg`. It implements `Heisenberg` interface.

## (interface) Heisenberg\<P\>

This interface represents an Optional of Monad programming. The common interface
for `Absent<P>`, `Lost<P>`, `Present<P>` and `Uncertain<P>`. This interface provides common methods for the value
presence and absence. `P` represents the type of the data.

### `Heisenberg.all<P>(heisenbergs: Iterable<Heisenberg<P>>): Heisenberg<Array<P>>`

Takes an `Iterable<Heisenberg<P>>` and returns a single `Heisenberg<Array<P>>`. Returns `Present<Array<P>>` when
all `heisenbergs` are in the `Present` state, returns `Absent<Array<P>>` when at least one of `heisenbergs` is in
the `Absent` state, and returns `Lost<Array<P>>` when at least one of `heisenbergs` is in the `Lost`state. If there are
both `Absent` and `Lost` states present in the `heisenbergs`, the return value will be `Lost<Array<P>>` (prioritized).

### `Heisenberg.prototype.get(): Exclude<P, null | undefined | void>`

Retrieves the retained value. If this instance is `Present`, the returned value will be a non-null, non-undefined value
of type `P`. If this instance is `Absent` or `Uncertain`, `HeisenbergError` will be thrown. If this instance is `Lost`,
the retained `cause` will be thrown.

### `Heisenberg.prototype.getState(): HeisenbergState`

Returns the current state. The state can be one of the following statuses: `'ABSENT'`, `'LOST'`, `'PRESENT'`
or `'UNCERTAIN'`.

### `Heisenberg.prototype.ifAbsent(consumer: Consumer<void>): this`

Executes the given `consumer` if this class instance is the `Absent` state.

### `Heisenberg.prototype.ifLost(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if this class instance is in the `Lost`
state.

### `Heisenberg.prototype.ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this`

Executes the given `consumer` with the internal non-null, non-undefined value of `P` type if this class instance
is in the `Present` state.

### `Heisenberg.prototype.isAbsent(): this is Absent<P>`

Returns `true` if this class instance is in the `Absent` state, `false` otherwise.

### `Heisenberg.prototype.isLost(): this is Lost<P>`

Returns `true` if this class instance is in the `Lost` state, `false` otherwise.

### `Heisenberg.prototype.isPresent(): this is Present<P>`

Returns `true` if this class instance is in the `Present` state, `false` otherwise.

# Schrödinger classes

## Alive\<A, D extends Error\>

A class that represents the fulfilled state for `Schrodinger`. This class contains a value of type `A` that cannot be
`Error`. It is equivalent to Success for Result types. It implements `Schrodinger` class.

## Contradiction\<A, D extends Error\>

A class that represents the rejected state for `Schrodinger`. This class contains an exception for the operation that
occurred. It implements `Schrodinger` interface.

## Dead\<A, D extends Error\>

A class that represents the fulfilled state for `Schrodinger`, but with an intended error of type `D`. It is equivalent
to Failure for Result types and it implements `Schrodinger` interface.

## Still\<A, D extends Error\>

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

### `Schrodinger.prototype.get(): Exclude<A, Error>`

Returns the retained value, the returned value cannot be `Error`.

Retrieves the retained value. If this instance is `Alive`, the returned value will be a non-error value of type `A`. If
this instance is `Dead`, the retained error will be thrown. If this instance is `Contradiction`, the retained `cause`
will be thrown. If this instance is `Still`, `SchrodingerError` will be thrown.

### `Schrodinger.prototype.getState(): SchrodingerState`

Returns the current state. The state can be one of the following statuses: `'ALIVE'`, `'CONTRADICTION'`, `'DEAD'`
or `'STILL'`.

### `Schrodinger.prototype.ifAlive(consumer: Consumer<Exclude<A, Error>>): this`

Executes the given `consumer` with the non-error value of `A` type if this class instance is in the `Alive` state.

### `Schrodinger.prototype.ifContradiction(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if this class instance is in
the `Contradiction` state.

### `Schrodinger.prototype.ifDead(consumer: Consumer<D>): this`

Executes the given `consumer` with the error value of `D` type if this class instance is in the `Dead` state.

### `Schrodinger.prototype.isAlive(): this is Alive<A, D>`

Returns `true` if this class instance is in the `Alive` state, `false` otherwise.

### `Schrodinger.prototype.isContradiction(): this is Contradiction<A, D>`

Returns `true` if this class instance is in the `Contradiction` state, `false` otherwise.

### `Schrodinger.prototype.isDead(): this is Dead<A, D>`

Returns `true` if this class instance is in the `Dead` state, `false` otherwise.

# Superposition classes

## (interface) Chrono\<M, R\>

### `Chrono.prototype.accept(valye: Exclude<M, Error>): unknown`

### `Chrono.prototype.catch(errors: Iterable<DeadConstructor<R>>): void`

### `Chrono.prototype.decline(value: R): unknown`

### `Chrono.prototype.getErrors(): Set<DeadConstructor<R>>`

### `Chrono.prototype.throw(cause: unknown): unknown`

## Superposition\<A, D extends Error\>

A class that handles Result of Monad programming asynchronously. This class wraps a `Schrodinger` instance, which
represents the outcome of an asynchronous operation, and can change its state based on the outcome of that operation.

Like `Promise`, the Superposition class can handle multiple states, but it is more finely divided than `Promise`. The
possible states are:

- Successfully fulfilled: corresponds to a fulfilled state of `Promise`.
- Unsuccessfully fulfilled: corresponds to a rejected state of `Promise`, but only for expected errors.
- Rejected: corresponds to a rejected state of `Promise`, but for unexpected errors.
- Pending: corresponds to a pending state of `Promise`.

### `Superposition.all<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D>`

Takes an `Iterable<Superposition<A, D>>` and returns a single `Superposition<Array<A>, D>`. If all `superpositions` are
in the `Alive` state, the returned instance will be successfully fulfilled with an array of the values from the
`superpositions`. If at least one of `superpositions` is in the `Dead` state, the returned instance will be
unsuccessfully fulfilled with the error from the first `Dead` state encountered. If at least one of `superpositions` is
in the `Contradiction` state, the returned instance will be rejected with the cause from the first `Contradiction` state
encountered. If there are both `Dead` and `Contradiction` states present in the `superpositions`, the returned instance
will be rejected (prioritized).

### `Superposition.anyway<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>>`

Retrieves the outcome of each asynchronous operation in `superpositions` by
calling `Superposition.prototype.terminate()` on each item. The resulting `Schrodinger` state for each `Superposition`
can be found in the documentation for `Superposition.prototype.terminate()`.

### `Superposition.of<A, D extends Error>(func: Consumer<Chrono<Awaited<A>, D>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Awaited<A>, D>`

Generates a new `Superposition` instance by invoking the provided `func` argument with a `Chrono` object. If
the `Chrono.prototype.accept(value)` is called with a valid value of `Awaited<A>` type, it returns a successfully
fulfilled `Superposition<A, D>`. If the `Chrono.prototype.decline(error)` is called with an error of type `D` that is
specified in the `errors` argument, it returns an unsuccessfully fulfilled `Superposition<A, D>`. If
the `Chrono.prototype.throw(cause)` is called with an argument of `unknown` type, it returns a
rejected `Superposition<A, D>`.

```ts
// let value is type of A or PromiseLike<A>
Superposition.of<A, D>((chrono: Chrono<Awaited<A>, D>) => {
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

### `Superposition.ofSchrodinger<A, D extends Error>(schrodinger: Schrodinger<Awaited<A>, D>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Awaited<A>, D>`

Creates a new `Superposition` instance from a given `Schrodinger` instance. The `errors` parameter is an array of error
constructors that can be thrown by the asynchronous operation. If the given `schrodinger` is in the `Alive` state, the
resulting `Superposition` will be successfully fulfilled. If it is in the `Dead` state, it will be unsuccessfully
fulfilled. If it is in the `Contradiction` or `Still` state, it will be rejected.

### `Superposition.ofSuperposition<A, D extends Error>(superposition: ISuperposition<A, D>): Superposition<A, D>`

Generates a new `Superposition` instance from a given `Superposition` instance.

### `Superposition.playground<A, D extends Error>(supplier: Supplier<Exclude<A, Error> | PromiseLike<Exclude<A, Error>>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Awaited<A>, D>`

Creates a new `Superposition` instance by executing the provided `supplier`. If the function returns a value of type `A`
or a fulfilled `PromiseLike<A>`, the resulting `Superposition` will be successfully fulfilled. If the function
throws an error or returns a rejected `PromiseLike<A>`, but the error is of a type specified in the `errors` argument,
the resulting `Superposition` will be unsuccessfully fulfilled. If the error is not of a type specified in the `errors`
argument, the resulting `Superposition` will be rejected.

### `Superposition.prototype.get(): Promise<Exclude<A, Error>>`

Retrieves the outcome of the asynchronous operation as a `Promise`. If the instance is in the successfully fulfilled
state, it will return a fulfilled `Promise` instance. If the instance is in the unsuccessfully fulfilled or rejected
state, it will return a rejected `Promise` instance.

### `Superposition.prototype.getErrors(): Set<DeadConstructor<D>>`

Returns a set of error constructors that can be thrown by the asynchronous operation.

### `Superposition.prototype.ifAlive(consumer: Consumer<Exclude<A, Error>>): this`

Executes the given `consumer` with the non-error value of `A` type if the asynchronous operation is going to be
successfully fulfilled.

### `Superposition.prototype.ifContradiction(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if the asynchronous operation is going
to be rejected.

### `Superposition.prototype.ifDead(consumer: Consumer<D>): this`

Executes the given `consumer` with the error value of `D` type if the asynchronous operation is going to be
unsuccessfully fulfilled.

### `Superposition.prototype.map<B = A, E extends Error = D>(mapper: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, D | E>`

Executes the given `mapper` only when the current instance is in a successfully fulfilled state. The `mapper` should
take in a single argument of type `Exclude<A, Error>` and should return a value of type `B` without an error, or an
instance of `ISuperposition<B, E>`, a `PromiseLike<Exclude<B, Error>>`, or a `PromiseLike<ISuperposition<B, E>>`.
The return value of this method will be a `Superposition<B, E>` instance if the `mapper` is executed and returns a value
or `Superposition<B, E>` without error, otherwise it will return a `Superposition<B, D>` instance if the `mapper` is not
executed or the returned value contain an error. The overall result will be a `Superposition<B, D | E>` instance.

This method can be used as an alternative to `Promise.prototype.then()`.

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

### `Superposition.prototype.pass(accepted: Consumer<Exclude<A, Error>>, declinded: Consumer<D>, thrown: Consumer<unknown>): this`

Executes the given `accepted` with the non-error value of type `A` when the asynchronous operation is successfully
fulfilled, `declined` with the error value of type `D` when the asynchronous operation is unsuccessfully fulfilled, or
`thrown` with the internal `cause` value of type `unknown` when the asynchronous operation is rejected.

### `Superposition.prototype.peek(peek: Peek): this`

Executes the given `peek` with no arguments when the asynchronous operation represented by the current superposition
instance is completed, regardless of whether it is successfully fulfilled, unsuccessfully fulfilled, or rejected. It
allows you to perform side effects, such as logging, without changing the outcome of the operation.

### `Superposition.prototype.recover<B = A, E extends Error = D>(mapper: UnaryFunction<D>, SReturnType<B, E>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, D | E>`

Executes the given `mapper` only when the current instance is in an unsuccessfully fulfilled state. The `mapper` should
take in a single argument of type `D` and should return a value of type `B` without an error, or an instance of
`ISuperposition<B, E>`, a `PromiseLike<Exclude<B, Error>>`, or a `PromiseLike<ISuperposition<B, E>>`. The return value
of this method will be a `Superposition<B, E>` instance if the `mapper` is executed and returns a value
or `Superposition<B, E>` without error, otherwise it will return a `Superposition<A, E>` instance if the `mapper` is not
executed or the returned value contains an error. The overall result will be a `Superposition<A | B, E>` instance.

This method can be used as an alternative to `Promise.prototype.catch()`.

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

  return 1;
});
```

### `Superposition.prototype.terminate(): Promise<Schrodinger<A, D>>`

Terminates the asynchronous operation represented by the current `Superposition` instance and obtain the final state of
the operation represented by a `Schrodinger` instance. If the `Superposition` is successfully fulfilled, the returned
`Schrodinger` will be in the `Alive` state, containing the value of the operation. If the `Superposition` is
unsuccessfully fulfilled, the returned `Schrodinger` will be in the `Dead` state, containing the error that caused the
failure. If the `Superposition` is rejected, the returned `Schrodinger` will be in the `Contradiction` state, indicating
that the operation has been rejected for an unknown reason.

### `Superposition.prototype.transform<B = A, E extends Error = D>(alive: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>, dead: UnaryFunction<D, SReturnType<B, D>>, ...errors: ReadonlyArray<DeadConstructor<E>>): Superposition<B, E>`

Executes the given `alive` only when the current instance is in a successfully fulfilled state, and also executes the
`dead` only when the current instance is in an unsuccessfully fulfilled state. One of these functions will be executed
unless the current instance is in a rejected state. The overall result will be a `Superposition<B, E>` instance.

This method combines the functionality of `Superposition.prototype.map()` and `Superposition.prototype.recover()` into
one, allowing you to handle both successful and unsuccessful outcomes of the asynchronous operation in a single call.

# Ünscharferelation classes

## (interface) Epoque\<M\>

### `epoque.accept(valye: Exclude<M, null | undefined | void>): unknown`

### `epoque.decline(): unknown`

### `epoque.throw(cause: unknown): unknown`

## Unscharfeleration\<P\>

A class that handles Optional of Monad programming asynchronously. This class wraps a `Heisenberg` instance, which
represents the outcome of an asynchronous operation, and can change its state based on the outcome of that operation.

Like `Promise`, the Unscharferelation class can handle multiple states, but it is more finely divided than `Promise`.
The possible states are:

- Successfully fulfilled: corresponds to a fulfilled state of `Promise`.
- Unsuccessfully fulfilled: corresponds to a rejected state of `Promise`, but only for `null` and `undefined`.
- Rejected: corresponds to a rejected state of `Promise`.
- Pending: corresponds to a pending state of `Promise`.

### `Unscharferelation.all<P>(unscharferelations: Iterable<Unscharfeleration<P>>): Unscharfeleration<Array<P>>`

Takes an `Iterable<Unscharferelation<P>>` and returns a single `Unscharferelation<Array<P>>`. If
all `unscharferelations` are in the `Present` state, the returned instance will be successfully fulfilled with an array
of the values from the `unscharferelations`. If at least one of `unscharferelations` is in the `Absent` state, the
returned instance will be unsuccessfully fulfilled with `null` of `undefined` from the first `Absent` state encountered.
If at least one of `unscharferelations` is in the `Lost` state, the returned instance will be rejected with the cause
from the first `Lost` state encountered. If there are both `Absent` and `Lost` states present in
the `unscharferelations`, the returned instance will be rejected (prioritized).

### `Unscharferelation.anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>>`

Retrieves the outcome of each asynchronous operation in `unscharferelations` by
calling `Unscharferelation.prototype.terminate()` on each item. The resulting `Heisenberg` state for
each `Unscharferelation` can be found in the documentation for `Unscharferelation.prototype.terminate()`.

### `Unscharferelation.maybe<P>(value: P | PromiseLike<null | undefined | void> | PromiseLike<P> | null | undefined | void): Unscharferelation<Awaited<P>>`

Creates a new `Unscharferelation` from the given value of type `P` or a `PromiseLike<P>`. If the value is `null`,
`undefined`, or a `PromiseLike` that resolves to `null` or `undefined`, the resulting `Unscharferelation` will be
unsuccessfully fulfilled. If a rejected `Promise` is given, the resulting `Unscharferelation` will be rejected.

### `Unscharferelation.of<P>(func: Consumer<Epoque<Awaited<P>>>): Unscharferelation<Awaited<P>>`

Generates a new `Unscharferelation` instance by invoking the provided `func` argument with a `Epoque` object. If
the `epoque.accept(value)` is called with a valid value of `Awaited<A>` type, it returns a successfully
fulfilled `Unscharferelation<P>`. If the `Epoque.prototype.decline()` is called, it returns an unsuccessfully
fulfilled `Unscharferelation<P>`. If the `Epoque.prototype.throw(cause)` is called with an argument of `unknown` type,
it returns a rejected `Unscharferelation<P>`.

```ts
// let value is type of P or PromiseLike<P>
Unscharferelation.of<P>((epoque: Epoque<Awaited<P>>) => {
  try {
    if (value !== null) {
      epoque.accept(value);

      return;
    }

    epoque.decline();
  }
  catch (e: unknown) {
    epoque.throw(e);
  }
});
```

### `Unscharferelation.ofHeisenberg<P>(heisenberg: Heisenberg<Awaited<P>>): Unscharferelation<Awaited<P>>`

Creates a new `Unscharferelation` instance from a given `Heisenberg` instance. If the given `heisenberg` is in
the `Present` state, the resulting `Unscharferelation` will be successfully fulfilled. If it is in the `Absent` state,
it will be unsuccessfully fulfilled. If it is in the `Lost` or `Uncertain` state, it will be rejected.

### `Unscharferelation.ofUnscharferelation<P>(unscharferelation: IUnscharferelation<P>): Unscharferelation<P>`

Generates a new `Unscharferelation` instance from a given `Unscharferelation` instance.

### `Unscharferelation.prototype.get(): Promise<Exclude<P, null | undefined | void>>`

Retrieves the outcome of the asynchronous operation as a `Promise`. If the instance is in the successfully fulfilled
state, it will return a fulfilled `Promise` instance. If the instance is in the unsuccessfully fulfilled or rejected
state, it will return a rejected `Promise` instance.

### `Unscharferelation.prototype.ifAbsent(consumer: Consumer<void>): this`

Executes the given `consumer` if the asynchronous operation is going to be unsuccessfully fulfilled.

### `Unscharferelation.prototype.ifLost(consumer: Consumer<unknown>): this`

Executes the given `consumer` with the internal `cause` value of `unknown` type if the asynchronous operation is going
to be rejected.

### `Unscharferelation.prototype.ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this`

Executes the given `consumer` with the non-null, non-undefined value of `P` type if the asynchronous operation is going
to be
successfully fulfilled.

### `Unscharferelation.prototype.map<Q = P>(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>): Unscharferelation<Q>`

Executes the given `mapper` only when the current instance is in a successfully fulfilled state. The `mapper` should
take in a single argument of type `Exclude<A, null | undefined | void>` and should return a value of type `Q` with a
non-null, non-undefined, or an instance of `IUnscharferelation<Q>`,
a `PromiseLike<Exclude<Q, null | undefined | void>>`, or a `PromiseLike<IUnscharferelation<Q>>`. The return value of
this method will be a `Unscharferelation<Q>` instance if the `mapper` is executed and returns a value
or `Unscharferelation<Q>`.

This method can be used as an alternative to `Promise.prototype.then()`.

```ts
unscharferelation.map<string>((num: number) => {
  return num.toFixed();
}).map<number>((str: string) => {
  const num = Number(str);

  if (Number.isNaN(num)) {
    throw new TypeError('NaN');
  }

  return num;
});
```

### `Unscharfeleration.prototype.pass(accepted: Consumer<Exclude<P, null | undefined | void>>, declinded: Consumer<void>, thrown: Consumer<unknown>): this`

Executes the given `accepted` with the non-null, non-undefined value of type `P` when the asynchronous operation is
successfully fulfilled, `declined` when the asynchronous operation is unsuccessfully fulfilled, or `thrown` with the
internal `cause` value of type `unknown` when the asynchronous operation is rejected.

### `Unscharferelation.prototype.peek(peek: Peek): this`

Executes the given `peek` with no arguments when the asynchronous operation represented by the current unscharferelation
instance is completed, regardless of whether it is successfully fulfilled, unsuccessfully fulfilled, or rejected. It
allows you to perform side effects, such as logging, without changing the outcome of the operation.

### `Unscharferelation.prototype.recover<Q = P>(mapper: Supplier<UReturnType<Q>>): Unscharferelation<P | Q>`

Executes the given `mapper` only when the current instance is in an unsuccessfully fulfilled state. The `mapper` should
return a value of type `Q` with a non-null, non-undefined, or an instance of
`IUnscharferelation<Q>`, a `PromiseLike<Exclude<Q, null | undefined | void>>`, or
a `PromiseLike<IUnscharferelation<Q>>`. The return value of this method will be a `Unscharferelation<Q>` instance if
the `mapper` is executed and returns a value or `Unscharferelation<Q>` without error, otherwise it will return
a `Superposition<P>` instance if the `mapper` is not executed or the returned value contains an error. The overall
result will be a `Unscharferelation<P | Q>` instance.

This method can be used as an alternative to `Promise.prototype.catch()`.

```ts
unscharferelation.map<string>((num: number) => {
  return num.toFixed();
}).map<number>((str: string) => {
  const num = Number(str);

  if (Number.isNaN(num)) {
    throw new TypeError('NaN');
  }

  return num;
}).recover<number>(() => {
  logger.error('null or undefined given');

  return 1;
});
```

### `Unscharferelation.prototype.terminate(): Promise<Heisenberg<P>>`

Terminates the asynchronous operation represented by the current `Unscharferelation` instance and obtain the final state
of the operation represented by a `Heisenberg` instance. If the `Unscharferelation` is successfully fulfilled, the
returned `Heisenberg` will be in the `Present` state, containing the value of the operation. If the `Unscharferelation`
is unsuccessfully fulfilled, the returned `Heisenberg` will be in the `Absent` state, containing the error that caused
the failure. If the `Unscharferelation` is rejected, the returned `Heisenberg` will be in the `Lost` state, indicating
that the operation has been rejected for an unknown reason.

## License

[MIT](LICENSE)

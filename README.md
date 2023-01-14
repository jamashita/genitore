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
both `Absent<P>` and `Lost<P>` states present in the `heisenbergs`, the return value will
be `Lost<Array<P>>` (prioritized).

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
state. If there are both `Dead<A, D>` and `Contradiction<A,D>` states present in the `schrodingers`, the return value
will be `Contradiction<Array<A>, D>` (prioritized).

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

## License

[MIT](LICENSE)
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

A class that represents the fulfilled state for `Heisenberg`, but with the absence of a value. It means the value
is `null`or `undefined`. It is equivalent to None for Optional types.

## Lost<P>

A class that represents the rejected state for `Heisenberg`. This class contains an exception for the operation that
occurred. It is equivalent to Error in other programming concepts.

## Present<P>

A class that represents the fulfilled state for `Heisenberg`. This class contains a value of type `P` that cannot be
`null` or `undefined`. It is equivalent to Some for Optional types.

## Uncertain<P>

A class that represents the pending state for `Heisenberg`. This is equivalent pending state for Promise.

## (interface) Heisenberg\<P\>

This interface represents an Optional of Monad programming. The common interface
for `Absent<P>`, `Lost<P>`, `Present<P>` and `Uncertain<V>`. This interface provides common methods for the value
existence. `P` represents the type of the data.

### `Heisenberg.all<P>(heisenbergs: Iterable<Heisenberg<P>>): Heisenberg<Array<P>>`

Takes a `Iterable<Heisenberg<P>>` and return a single `Heisenberg<Array<P>>`. Returns `Present<Array<P>>` when
all `heisenbergs` were `Present<P>`, Returns `Absent<Array<P>>` when at least one of `heisenbergs` were `Absent<P>`,
Returns `Lost<Array<P>>` when at least one of `heisenbergs` were `Lost<P>`. If there are `Absent<P>` and `Lost<P>` both
in the `heisenbergs`, the return value will be `Lost<P>` (prioritised).

Takes an `Iterable<Heisenberg<P>>` and returns a single `Heisenberg<Array<P>>`. Returns `Present<Array<P>>` when
all `heisenbergs` are `Present<P>`, Returns `Absent<Array<P>>` when at least one of `heisenbergs` is `Absent<P>`,
Returns `Lost<Array<P>>` when at least one of `heisenbergs` is `Lost<P>`. If there are `Absent<P>` and `Lost<P>` both
in the `heisenbergs`, the return value will be `Lost<Array<P>>` (prioritized).

### `heisenberg.get(): Exclude<P, null | undefined | void>`

Returns the retained value, the returned value cannot be `null` or `undefined`.

### `heisenberg.getState(): HeisenbergState`

Returns the current state. The state can be one of the following statuses: `'ABSENT'`, `'LOST'`, `'PRESENT'`
or `'UNCERTAIN'`.

### `heisenberg.ifAbsent(consumer: Consumer<void>): this`

Executes the given `consumer` if this class instance is `Absent`.

### `heisenberg.ifLost(consumer: Consumer<unknown>): this`

Executes the given `consumer` if this class instance is `Lost`.

### `heisenberg.ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this`

Executes the given `consumer` with the non-null, non-undefined value of `P` type if this class instance is `Present`.

### `heisenberg.isAbsent(): this is Absent<P>`

Returns `true` if this class instance is `Absent<P>`. or `false` otherwise.

### `heisenberg.isLost(): this is Lost<P>`

Returns `true` if this class instance is `Lost<P>`. or `false` otherwise.

### `heisenberg.isPresent(): this is Present<P>`

Returns `true` if this class instance is `Present<P>`. or `false` otherwise.

## License

[MIT](LICENSE)
import { MockRuntimeError } from '@jamashita/anden/error';
import { Mock } from 'vitest';
import { Plan } from '../../plan/index.js';
import { Schrodinger } from '../../schrodinger/index.js';
import { Chrono } from '../Chrono.js';
import { SuperpositionInternal } from '../SuperpositionInternal.js';

describe('SuperpositionInternal', () => {
  describe('toString', () => {
    it('returns its retaining Schrodinger string', () => {
      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError(''));
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        [MockRuntimeError]
      );

      expect(superposition1.toString()).toBe('Alive: -1');
      expect(superposition2.toString().includes('Dead: MockRuntimeError')).toBe(true);
      expect(superposition3.toString()).toBe('Contradiction: null');
    });
  });

  describe('accept', () => {
    it('does nothing if done once', async () => {
      const value: number = -35;
      const fn: Mock = vi.fn();
      const plans: Set<Plan<Exclude<number, Error>, MockRuntimeError>> = new Set();

      plans.forEach = fn;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger1.get()).toBe(value);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all maps', async () => {
      const value: number = -1.3;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await superposition.map<number>((v: number) => {
        fn2();
        expect(v).toBe(value);

        return v + 3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
    });
  });

  describe('decline', () => {
    it('does nothing if done once', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');
      const fn: Mock = vi.fn();
      const plans: Set<Plan<Exclude<number, Error>, MockRuntimeError>> = new Set();

      plans.forEach = fn;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.decline(error);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all recovers', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      await superposition.recover<number, MockRuntimeError>(() => {
        fn1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        fn2();

        return 3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
    });
  });

  describe('throw', () => {
    it('does nothing if done once', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');
      const fn: Mock = vi.fn();
      const plans: Set<Plan<Exclude<number, Error>, void>> = new Set();

      plans.forEach = fn;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isContradiction()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(error);

      superposition.throw(error);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all throws', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await superposition.map<number, MockRuntimeError>(() => {
        fn1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        fn2();

        return 3;
      }).terminate();

      await superposition.map<number, MockRuntimeError>(() => {
        fn3();

        return 2;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        fn4();

        return 1;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await expect(superposition1.get()).resolves.toStrictEqual(value);
      await expect(superposition2.get()).rejects.toThrow(error);
      await expect(superposition3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass instance', async () => {
      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError('');

      const alive: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      ).terminate();
      const dead: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      ).terminate();
      const contradiction: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      ).terminate();

      expect(alive.isAlive()).toBe(true);
      expect(alive.get()).toBe(value);
      expect(dead.isDead()).toBe(true);
      expect(() => {
        dead.get();
      }).toThrow(error);
      expect(contradiction.isContradiction()).toBe(true);
      expect(() => {
        contradiction.get();
      }).toThrow(error);
    });
  });

  describe('map', () => {
    it('invokes callbacks unless it is not Dead nor Contradiction', async () => {
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        fn2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value + 2);

        return v + 1;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise', async () => {
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }).map<number, MockRuntimeError>((v: number) => {
        fn2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 2);
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Alive Superposition', async () => {
      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return superposition3;
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value3);

        return superposition3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value3);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback throws Dead error', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        fn2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        fn3();

        throw error;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns rejected Promise Dead', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.reject<number>(error);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return superposition3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        fn2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        fn3();

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        fn4();

        throw error;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        fn4();

        return Promise.reject<number>(error);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return superposition4;
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        fn4();

        return superposition4;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.map<number>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        fn2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        fn4();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1: number = 2;
      const value2: number = 20;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Superposition', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        fn3();

        return superposition2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return superposition2;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value);

        return superposition2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('recover', () => {
    it('invokes callbacks unless it is not Alive nor Contradiction', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        fn1();

        return v + 1;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        fn1();

        return Promise.resolve<number>(v + 1);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return Promise.resolve<number>(value + 13);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(v + 13);

        return Promise.resolve<number>(v + 130);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Alive Superposition', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>(() => {
        fn1();

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return superposition3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>(() => {
        fn1();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback throws Dead error', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn1();
        expect(err).toBe(error1);

        throw error2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback returns rejected Promise Dead', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn1();
        expect(err).toBe(error1);

        return Promise.reject<number>(error2);
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error1);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(v + 13);

        return superposition3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error1);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(v + 13);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        fn3();

        return value + 130;
      }).recover<number, MockRuntimeError>(() => {
        fn4();

        return value + 13;
      }, MockRuntimeError).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return Promise.reject<number>(error);
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.reject<number>(error);
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        fn4();

        return Promise.reject<number>(error);
      }, MockRuntimeError).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        fn3();

        return superposition4;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>(() => {
        fn2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        fn3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number>((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Superposition', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn3();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        fn1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        fn2();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        fn3();
        expect(v).toBe(error);

        return superposition2;
      }, MockRuntimeError).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('transform', () => {
    it('invokes first callback when Superposition is Alive', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          fn1();
          expect(v).toBe(value1);

          return value2;
        },
        () => {
          fn2();

          return value3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn3();
          expect(v).toBe(value2);

          return value2;
        },
        () => {
          fn4();

          return value3;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          fn1();
          expect(v).toBe(value1);

          return Promise.resolve<number>(value2);
        },
        () => {
          fn2();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn3();
          expect(v).toBe(value2);

          return Promise.resolve<number>(value2);
        },
        () => {
          fn4();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Alive Superposition', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          fn1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          fn2();

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          fn4();

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise<Alive Superposition>', async () => {
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          fn1();
          expect(v).toBe(value1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        () => {
          fn2();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn3();
          expect(v).toBe(value2);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        () => {
          fn4();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Superposition is Dead', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          fn1();

          throw error2;
        },
        (err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          throw error3;
        }
      ).transform<number, MockRuntimeError>(
        () => {
          fn3();

          throw error2;
        },
        (err: MockRuntimeError) => {
          fn4();
          expect(err).toBe(error1);

          throw error3;
        }
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Superposition is Dead even if the return value is rejected Promise', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          fn1();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          fn3();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          fn4();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Dead Superposition', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          fn1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          fn3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          fn4();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Promise<Dead Superposition>', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error3);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          fn1();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        (err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          fn3();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        (err: MockRuntimeError) => {
          fn4();
          expect(err).toBe(error1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();
      const fn5: Mock = vi.fn();
      const fn6: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          fn1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          fn2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          fn4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          fn5();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          fn6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
      expect(fn5.mock.calls).toHaveLength(1);
      expect(fn6.mock.calls).toHaveLength(0);
    });

    it('instantly declines once declined Superposition', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();
      const fn5: Mock = vi.fn();
      const fn6: Mock = vi.fn();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          fn1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          fn3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          fn4();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          fn5();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          fn6();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
      expect(fn5.mock.calls).toHaveLength(0);
      expect(fn6.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();
      const fn5: Mock = vi.fn();
      const fn6: Mock = vi.fn();

      await superposition1.transform<number>(
        () => {
          fn1();

          return superposition2;
        },
        () => {
          fn2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          fn3();

          return superposition2;
        },
        () => {
          fn4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          fn5();

          return superposition2;
        },
        () => {
          fn6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
      expect(fn5.mock.calls).toHaveLength(0);
      expect(fn6.mock.calls).toHaveLength(0);
    });
  });

  describe('ifAlive', () => {
    it('invokes callback if Superposition is Alive', async () => {
      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive((n: number) => {
        fn();
        expect(n).toBe(value);
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('invokes callback if Superposition is Dead', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead((e: MockRuntimeError) => {
        fn();
        expect(e).toBe(error);
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('invokes callback if Superposition is Contradiction', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction((e: unknown) => {
        fn();
        expect(e).toBe(error);
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('pass', () => {
    it('invokes first callback if Superposition is Alive', () => {
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      superposition.pass(
        (v: number) => {
          fn1();
          expect(v).toBe(value);
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('invokes second callback if Superposition is Dead', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      superposition.pass(
        () => {
          fn1();
        },
        (e: MockRuntimeError) => {
          fn2();
          expect(e).toBe(error);
        },
        () => {
          fn3();
        }
      );

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('invokes third callback if Superposition is Contradiction', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      superposition.pass(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (e: unknown) => {
          fn3();
          expect(e).toBe(error);
        }
      );

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });

  describe('peek', () => {
    it('invokes first callback if Superposition is Alive', () => {
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes second callback if Superposition is Dead', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes third callback if Superposition is Contradiction', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const fn: Mock = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});


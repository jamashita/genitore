import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { Alive, Dead } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../../Chrono';
import { MockChrono } from '../../mock/MockChrono';
import { Superposition } from '../../Superposition';
import { DeadPlan } from '../DeadPlan';

describe('DeadPlan', () => {
  describe('onRecover', () => {
    it('invokes first callback when A given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return value;
          },
          new MockChrono(
            (n: number) => {
              fn2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<A> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.resolve(value);
          },
          new MockChrono(
            (n: number) => {
              fn2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Alive Superposition given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Superposition.ofSchrodinger(Alive.of(value));
          },
          new MockChrono(
            (n: number) => {
              fn2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<Alive Superposition> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.resolve(Superposition.ofSchrodinger(Alive.of(value)));
          },
          new MockChrono(
            (n: number) => {
              fn2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when D thrown', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            throw error;
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            (e: MockRuntimeError) => {
              fn3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when rejected Promise<A> given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            (e: MockRuntimeError) => {
              fn3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Dead Superposition given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Superposition.ofSchrodinger(Dead.of(error), MockRuntimeError);
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            (e: MockRuntimeError) => {
              fn3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<Dead Superposition given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.resolve(Superposition.ofSchrodinger(Dead.of(error), MockRuntimeError));
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            (e: MockRuntimeError) => {
              fn3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            throw error;
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set()
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set()
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Contradiction Superposition given', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
        (e: MockRuntimeError) => {
          fn1();
          expect(e).toBe(error);

          return Superposition.of((c: Chrono<number, MockRuntimeError>) => {
            return c.throw(error);
          });
        },
        new MockChrono(
          () => {
            fn2();
          },
          () => {
            fn3();
          },
          () => {
            fn4();
          },
          new Set()
        )
      );

      plan.onRecover(error);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Promise<Contradiction Superposition> given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of(
          (e: MockRuntimeError) => {
            fn1();
            expect(e).toBe(error);

            return Promise.resolve(Superposition.of((c: Chrono<number, MockRuntimeError>) => {
              return c.throw(error);
            }));
          },
          new MockChrono(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            },
            new Set()
          )
        );

        plan.onRecover(error);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });
  });
});

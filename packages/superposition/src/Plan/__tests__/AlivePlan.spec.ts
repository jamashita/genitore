import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { Chrono } from '../../Chrono';
import { MockChrono } from '../../mock/MockChrono';
import { Superposition } from '../../Superposition';
import { AlivePlan } from '../AlivePlan';

describe('AlivePlan', () => {
  describe('onMap', () => {
    it('invokes first callback when A given', async () => {
      const value: number = 101;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return n - 1;
        }, new MockChrono(
          (n: number) => {
            fn2();
            expect(n).toBe(value - 1);

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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<A> given', async () => {
      const value: number = 101;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.resolve<number>(n - 2);
        }, new MockChrono(
          (n: number) => {
            fn2();
            expect(n).toBe(value - 2);

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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Alive Superposition given', async () => {
      const value: number = 101;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Superposition.alive<number, MockRuntimeError>(n - 3);
        }, new MockChrono(
          (n: number) => {
            fn2();
            expect(n).toBe(value - 3);

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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<Alive Superposition> given', async () => {
      const value: number = 101;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.alive<number, MockRuntimeError>(n - 3));
        }, new MockChrono(
          (n: number) => {
            fn2();
            expect(n).toBe(value - 3);

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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when D thrown', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          throw error;
        }, new MockChrono(
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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when rejected Promise<A> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.reject<number>(error);
        }, new MockChrono(
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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Dead Superposition given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError);
        }, new MockChrono(
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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<Dead Superposition> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError));
        }, new MockChrono(
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
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          throw error;
        }, new MockChrono(
          () => {
            fn2();

            resolve();
          },
          () => {
            fn3();

            resolve();
          },
          (e: unknown) => {
            fn4();
            expect(e).toBe(error);

            resolve();
          },
          new Set()
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.reject<number>(error);
        }, new MockChrono(
          () => {
            fn2();

            resolve();
          },
          () => {
            fn3();

            resolve();
          },
          (e: unknown) => {
            fn4();
            expect(e).toBe(error);

            resolve();
          },
          new Set()
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Contradiction Superposition given', () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
        fn1();
        expect(n).toBe(value);

        return Superposition.of<number, MockRuntimeError>((c: Chrono<number, MockRuntimeError>) => {
          return c.throw(error);
        });
      }, new MockChrono(
        () => {
          fn2();
        },
        () => {
          fn3();
        },
        (e: unknown) => {
          fn4();
          expect(e).toBe(error);
        },
        new Set()
      ));

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Promise<Contradiction Superposition> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>((n: number) => {
          fn1();
          expect(n).toBe(value);

          return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.of<number, MockRuntimeError>((c: Chrono<number, MockRuntimeError>) => {
            return c.throw(error);
          }));
        }, new MockChrono(
          () => {
            fn2();

            resolve();
          },
          () => {
            fn3();

            resolve();
          },
          (e: unknown) => {
            fn4();
            expect(e).toBe(error);

            resolve();
          },
          new Set()
        ));

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });
  });
});

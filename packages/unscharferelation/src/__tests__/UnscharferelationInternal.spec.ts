import { MockRuntimeError } from '@jamashita/anden-error';
import { Heisenberg, HeisenbergError, Matter } from '@jamashita/genitore-heisenberg';
import { Plan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';
import { UnscharferelationError } from '../UnscharferelationError';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

describe('UnscharferelationInternal', () => {
  describe('toString', () => {
    it('returns its retaining Heisenberg string', () => {
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(null);
        }
      );

      expect(unscharferelation1.toString()).toBe('Present: -1');
      expect(unscharferelation2.toString()).toBe('Absent');
      expect(unscharferelation3.toString()).toBe('Lost: null');
    });
  });

  describe('accept', () => {
    it('does nothing if done once', async () => {
      const value: number = -35;

      const fn: jest.Mock = jest.fn();

      const plans: Set<Plan<Matter<number>, void>> = new Set();

      plans.forEach = fn;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      // @ts-expect-error
      unscharferelation.plans = plans;

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isPresent()).toBe(true);
      expect(heisenberg1.get()).toBe(value);

      unscharferelation.accept(value);

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      const value: number = -1.3;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await unscharferelation.map((v: number) => {
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
      const fn: jest.Mock = jest.fn();

      const plans: Set<Plan<Matter<number>, void>> = new Set();

      plans.forEach = fn;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      // @ts-expect-error
      unscharferelation.plans = plans;

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isAbsent()).toBe(true);

      unscharferelation.decline();

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      await unscharferelation.recover(() => {
        fn1();

        return 4;
      }).terminate();

      await unscharferelation.recover(() => {
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

      const fn: jest.Mock = jest.fn();

      const plans: Set<Plan<Matter<number>, void>> = new Set();

      plans.forEach = fn;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      // @ts-expect-error
      unscharferelation.plans = plans;

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isLost()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(error);

      unscharferelation.throw(error);

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      await unscharferelation.map(() => {
        fn1();

        return 4;
      }).terminate();

      await unscharferelation.recover(() => {
        fn2();

        return 3;
      }).terminate();

      await unscharferelation.map(() => {
        fn3();

        return 2;
      }).terminate();

      await unscharferelation.recover(() => {
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
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      await expect(unscharferelation1.get()).resolves.toBe(value);
      await expect(unscharferelation2.get()).rejects.toThrow(UnscharferelationError);
      await expect(unscharferelation3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Heisenberg subclass instance', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const present: Heisenberg<number> = await UnscharferelationInternal.of((epoque: Epoque<number>) => {
        epoque.accept(value);
      }).terminate();
      const absent: Heisenberg<number> = await UnscharferelationInternal.of((epoque: Epoque<number>) => {
        epoque.decline();
      }).terminate();
      const lost: Heisenberg<number> = await UnscharferelationInternal.of((epoque: Epoque<number>) => {
        epoque.throw(error);
      }).terminate();

      expect(present.isPresent()).toBe(true);
      expect(present.get()).toBe(value);
      expect(absent.isAbsent()).toBe(true);
      expect(() => {
        absent.get();
      }).toThrow(HeisenbergError);
      expect(lost.isLost()).toBe(true);
      expect(() => {
        lost.get();
      }).toThrow(error);
    });
  });

  describe('map', () => {
    it('invokes callbacks unless it is not Absent nor Lost', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return v + 1;
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 2);

        return v + 1;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Promise', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve(v + 1);
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value + 1);

        return Promise.resolve(v + 1);
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 2);

        return Promise.resolve(v + 1);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Present Unscharferelation', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value3);

        return unscharferelation3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Promise<Present Unscharferelation>', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return Promise.resolve(unscharferelation2);
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return Promise.resolve(unscharferelation3);
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value3);

        return Promise.resolve(unscharferelation3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback returns null', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return null;
      }).map(() => {
        fn2();

        return null;
      }).map(() => {
        fn3();

        return null;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<null>', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve(null);
      }).map(() => {
        fn2();

        return Promise.resolve(null);
      }).map(() => {
        fn3();

        return Promise.resolve(null);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Absent Unscharferelation', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map(() => {
        fn2();

        return unscharferelation3;
      }).map(() => {
        fn3();

        return unscharferelation3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Absent Unscharferelation>', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve(unscharferelation2);
      }).map(() => {
        fn2();

        return Promise.resolve(unscharferelation3);
      }).map(() => {
        fn3();

        return Promise.resolve(unscharferelation3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        throw error;
      }).map(() => {
        fn2();

        throw error;
      }).map(() => {
        fn3();

        throw error;
      }).recover(() => {
        fn4();

        throw error;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.reject(error);
      }).map(() => {
        fn2();

        return Promise.reject(error);
      }).map(() => {
        fn3();

        return Promise.reject(error);
      }).recover(() => {
        fn4();

        return Promise.reject(error);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Lost Unscharferelation', async () => {
      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map(() => {
        fn2();

        return unscharferelation3;
      }).map(() => {
        fn3();

        return unscharferelation4;
      }).recover(() => {
        fn4();

        return unscharferelation4;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Lost Unscharferelation>', async () => {
      const value1: number = -201;
      const value2: number = -220;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly accepts once accepted Unscharferelation', async () => {
      const value1: number = -201;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Unscharferelation', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation2;
      }).recover(() => {
        fn3();

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once declined Unscharferelation', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation2;
      }).map(() => {
        fn3();

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('recover', () => {
    it('invokes callbacks unless it is not Present nor Lost', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();

        return v + 1;
      }).recover(() => {
        fn2();

        return value + 23;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Promise', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();

        return Promise.resolve(v + 23);
      }).recover(() => {
        fn2();

        return Promise.resolve(value + 23);
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 23);

        return Promise.resolve(value + 23);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Present Unscharferelation', async () => {
      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map(() => {
        fn1();

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation3;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Promise<Present Unscharferelation>', async () => {
      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map(() => {
        fn1();

        return Promise.resolve(unscharferelation2);
      }).recover(() => {
        fn2();

        return Promise.resolve(unscharferelation3);
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return Promise.resolve(unscharferelation3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks with a callback returns null', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.recover(() => {
        fn1();

        return null;
      }).recover(() => {
        fn2();

        return value + 23;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks with a callback returns Promise<null>', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation.recover(() => {
        fn1();

        return Promise.resolve(null);
      }).recover(() => {
        fn2();

        return value + 23;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks with a callback returns Absent Unscharferelation', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation3;
      }).map(() => {
        fn3();

        return unscharferelation3;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks with a callback returns Promise<Absent Unscharferelation>', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve(unscharferelation2);
      }).recover(() => {
        fn2();

        return Promise.resolve(unscharferelation3);
      }).map(() => {
        fn3();

        return Promise.resolve(unscharferelation3);
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks with a callback throws unexpected error', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        throw error;
      }).recover(() => {
        fn2();

        throw error;
      }).map(() => {
        fn3();

        throw error;
      }).recover(() => {
        fn4();

        throw error;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks with a callback throws unexpected rejected Promise', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.reject(error);
      }).recover(() => {
        fn2();

        return Promise.reject(error);
      }).map(() => {
        fn3();

        return Promise.reject(error);
      }).recover(() => {
        fn4();

        throw error;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks with a callback returns Lost Unscharferelation', async () => {
      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation3;
      }).map(() => {
        fn3();

        return unscharferelation4;
      }).recover(() => {
        fn4();

        return unscharferelation4;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks with a callback returns Promise<Lost Unscharferelation>', async () => {
      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return Promise.resolve(unscharferelation2);
      }).recover(() => {
        fn2();

        return Promise.resolve(unscharferelation3);
      }).map(() => {
        fn3();

        return Promise.resolve(unscharferelation3);
      }).recover(() => {
        fn4();

        return unscharferelation4;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('instantly accepts once accepted Unscharferelation', async () => {
      const value1: number = -201;
      const value2: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map((v: number) => {
        fn2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map((v: number) => {
        fn3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Unscharferelation', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation2;
      }).recover(() => {
        fn3();

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Unscharferelation', async () => {
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      await unscharferelation1.map((v: number) => {
        fn1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover(() => {
        fn2();

        return unscharferelation2;
      }).map(() => {
        fn3();

        return unscharferelation2;
      }).terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('ifPresent', () => {
    it('invokes callback if Unscharferelation is Present', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent((v: number) => {
        fn();
        expect(v).toBe(value);
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(heisenberg.isPresent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Absent', async () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Lost', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('does not invoke callback if Unscharferelation is Present', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('invokes callback if Unscharferelation is Absent', async () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Lost', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('does not invoke callback if Unscharferelation is Present', async () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('does not invoke callback if Unscharferelation is Absent', async () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        fn();
      }).terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('invokes callback if Unscharferelation is Lost', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn: jest.Mock = jest.fn();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost((e: unknown) => {
        fn();
        expect(e).toBe(error);
      }).terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('pass', () => {
    it('invokes first callback if Unscharferelation is Present', () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      unscharferelation.pass(
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

    it('invokes second callback if Unscharferelation is Absent', () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      unscharferelation.pass(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('invokes third callback if Unscharferelation is Lost', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      unscharferelation.pass(
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
    it('invokes first callback if Unscharferelation is Present', () => {
      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const fn: jest.Mock = jest.fn();

      unscharferelation.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes second callback if Unscharferelation is Absent', () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const fn: jest.Mock = jest.fn();

      unscharferelation.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes third callback if Unscharferelation is Lost', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const fn: jest.Mock = jest.fn();

      unscharferelation.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});

import { MockRuntimeError } from '@jamashita/anden/error';
import type { Plan } from '../../plan/index.js';
import type { Chrono } from '../Chrono.js';
import { SuperpositionInternal } from '../SuperpositionInternal.js';

describe('SuperpositionInternal', () => {
  describe('accept', () => {
    it('does nothing if done once', async () => {
      const value = -35;
      const fn = vi.fn();
      const plans = new Set<Plan<Exclude<number, Error>, MockRuntimeError>>();

      plans.forEach = fn;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1 = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger1.get()).toBe(value);

      superposition.accept(value);

      const schrodinger2 = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all maps', async () => {
      const value = -1.3;

      const fn1 = vi.fn();
      const fn2 = vi.fn();

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return v + 4;
        })
        .terminate();

      await superposition
        .map<number>((v: number) => {
          fn2();
          expect(v).toBe(value);

          return v + 3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
    });
  });

  describe('decline', () => {
    it('does nothing if done once', async () => {
      const error = new MockRuntimeError('');
      const fn = vi.fn();
      const plans = new Set<Plan<Exclude<number, Error>, MockRuntimeError>>();

      plans.forEach = fn;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1 = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.decline(error);

      const schrodinger2 = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all recovers', async () => {
      const error = new MockRuntimeError('');

      const fn1 = vi.fn();
      const fn2 = vi.fn();

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      await superposition
        .recover<number, MockRuntimeError>(() => {
          fn1();

          return 4;
        })
        .terminate();

      await superposition
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return 3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
    });
  });

  describe('throw', () => {
    it('does nothing if done once', async () => {
      const error = new MockRuntimeError('');
      const fn = vi.fn();
      const plans = new Set<Plan<Exclude<number, Error>, void>>();

      plans.forEach = fn;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1 = await superposition.terminate();

      expect(schrodinger1.isContradiction()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(error);

      superposition.throw(error);

      const schrodinger2 = await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all throws', async () => {
      const error = new MockRuntimeError('');

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      await superposition
        .map<number, MockRuntimeError>(() => {
          fn1();

          return 4;
        })
        .terminate();

      await superposition
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return 3;
        })
        .terminate();

      await superposition
        .map<number, MockRuntimeError>(() => {
          fn3();

          return 2;
        })
        .terminate();

      await superposition
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return 1;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value = -149;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      await expect(superposition1.get()).resolves.toStrictEqual(value);
      await expect(superposition2.get()).rejects.toThrow(error);
      await expect(superposition3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass instance', async () => {
      const value = -149;
      const error = new MockRuntimeError('');

      const alive = await SuperpositionInternal.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      }).terminate();
      const dead = await SuperpositionInternal.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      }).terminate();
      const contradiction = await SuperpositionInternal.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      }).terminate();

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
      const value = 2;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return v + 1;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn2();
          expect(v).toBe(value + 1);

          return v + 1;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value + 2);

          return v + 1;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise', async () => {
      const value = 2;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn2();
          expect(v).toBe(value + 1);

          return Promise.resolve<number>(v + 2);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value + 2);

          return Promise.resolve<number>(v + 1);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Alive Superposition', async () => {
      const value1 = 2;
      const value2 = 200;
      const value3 = 20000;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value1);

          return superposition2;
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return superposition3;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value3);

          return superposition3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      const value1 = 2;
      const value2 = 200;
      const value3 = 20000;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value1);

          return Promise.resolve(superposition2);
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return Promise.resolve(superposition3);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value3);

          return Promise.resolve(superposition3);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback throws Dead error', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          throw error;
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          throw error;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          throw error;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns rejected Promise Dead', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.reject<number>(error);
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return Promise.reject<number>(error);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.reject<number>(error);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return superposition3;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return superposition3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.resolve(superposition2);
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return Promise.resolve(superposition3);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.resolve(superposition3);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          throw error;
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          throw error;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          throw error;
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          throw error;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.reject<number>(error);
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return Promise.reject<number>(error);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.reject<number>(error);
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return Promise.reject<number>(error);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error2);
      });
      const superposition4 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return superposition3;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return superposition4;
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return superposition4;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error2);
      });
      const superposition4 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .map<number>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        })
        .map<number, MockRuntimeError>(() => {
          fn2();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1 = 2;
      const value2 = 20;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value1);

          return superposition2;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn2();
          expect(v).toBe(value2);

          return superposition2;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value2);

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Superposition', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return superposition2;
        })
        .recover<number, MockRuntimeError>(() => {
          fn3();

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return superposition2;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value);

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('recover', () => {
    it('invokes callbacks unless it is not Alive nor Contradiction', async () => {
      const value = -201;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number, MockRuntimeError>((v: number) => {
          fn1();

          return v + 1;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return value + 13;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value + 13);

          return value + 130;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise', async () => {
      const value = -201;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .map<number, MockRuntimeError>((v: number) => {
          fn1();

          return Promise.resolve<number>(v + 1);
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return Promise.resolve<number>(value + 13);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(v + 13);

          return Promise.resolve<number>(v + 130);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Alive Superposition', async () => {
      const value1 = 2;
      const value2 = 20;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>(() => {
          fn1();

          return superposition2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return superposition3;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value2);

          return superposition3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      const value1 = 2;
      const value2 = 20;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>(() => {
          fn1();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value2);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('will not invoke callbacks when a callback throws error', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn1();
          expect(err).toBe(error1);

          throw error2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error2);

          return value + 13;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value + 13);

          return value + 130;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns rejected Promise', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn1();
          expect(err).toBe(error1);

          return Promise.reject<number>(error2);
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error2);

          return value + 13;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value + 13);

          return value + 130;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return superposition3;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(v + 13);

          return superposition3;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(v + 13);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          throw error;
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return value + 13;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return value + 130;
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return value + 13;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.reject<number>(error);
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return Promise.reject<number>(error);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.reject<number>(error);
        })
        .recover<number, MockRuntimeError>(() => {
          fn4();

          return Promise.reject<number>(error);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error2);
      });
      const superposition4 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return superposition3;
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return superposition4;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      const value = 2;
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error1);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error2);
      });
      const superposition4 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return Promise.resolve(superposition2);
        })
        .recover<number, MockRuntimeError>(() => {
          fn2();

          return Promise.resolve(superposition3);
        })
        .map<number, MockRuntimeError>(() => {
          fn3();

          return Promise.resolve(superposition4);
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1 = 2;
      const value2 = 2;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value1);

          return superposition2;
        })
        .map<number>((v: number) => {
          fn2();
          expect(v).toBe(value2);

          return superposition2;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(value2);

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly declines once declined Superposition', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return superposition2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn3();
          expect(err).toBe(error);

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const value = 2;
      const error = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      await superposition1
        .map<number, MockRuntimeError>((v: number) => {
          fn1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockRuntimeError>((err: MockRuntimeError) => {
          fn2();
          expect(err).toBe(error);

          return superposition2;
        })
        .map<number, MockRuntimeError>((v: number) => {
          fn3();
          expect(v).toBe(error);

          return superposition2;
        })
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('transform', () => {
    it('invokes first callback when Superposition is Alive', async () => {
      const value1 = 2;
      const value2 = 20;
      const value3 = 200;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn1();
            expect(v).toBe(value1);

            return value2;
          },
          () => {
            fn2();

            return value3;
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn3();
            expect(v).toBe(value2);

            return value2;
          },
          () => {
            fn4();

            return value3;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise', async () => {
      const value1 = 2;
      const value2 = 20;
      const value3 = 200;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn1();
            expect(v).toBe(value1);

            return Promise.resolve(value2);
          },
          () => {
            fn2();

            return Promise.resolve(value3);
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn3();
            expect(v).toBe(value2);

            return Promise.resolve(value2);
          },
          () => {
            fn4();

            return Promise.resolve(value3);
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Alive Superposition', async () => {
      const value1 = 2;
      const value2 = 20;
      const value3 = 200;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn1();
            expect(v).toBe(value1);

            return superposition2;
          },
          () => {
            fn2();

            return superposition3;
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn3();
            expect(v).toBe(value2);

            return superposition2;
          },
          () => {
            fn4();

            return superposition3;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise<Alive Superposition>', async () => {
      const value1 = 2;
      const value2 = 20;
      const value3 = 200;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn1();
            expect(v).toBe(value1);

            return Promise.resolve(superposition2);
          },
          () => {
            fn2();

            return Promise.resolve(superposition3);
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn3();
            expect(v).toBe(value2);

            return Promise.resolve(superposition2);
          },
          () => {
            fn4();

            return Promise.resolve(superposition3);
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Superposition is Dead', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .transform<number, MockRuntimeError>(
          () => {
            fn1();

            throw error2;
          },
          (err: MockRuntimeError) => {
            fn2();
            expect(err).toBe(error1);

            throw error3;
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn3();

            throw error2;
          },
          (err: MockRuntimeError) => {
            fn4();
            expect(err).toBe(error1);

            throw error3;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Superposition is Dead even if the return value is rejected Promise', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition
        .transform<number, MockRuntimeError>(
          () => {
            fn1();

            return Promise.reject<number>(error2);
          },
          (err: MockRuntimeError) => {
            fn2();
            expect(err).toBe(error1);

            return Promise.reject<number>(error3);
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn3();

            return Promise.reject<number>(error2);
          },
          (err: MockRuntimeError) => {
            fn4();
            expect(err).toBe(error1);

            return Promise.reject<number>(error3);
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Dead Superposition', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          () => {
            fn1();

            return superposition2;
          },
          (err: MockRuntimeError) => {
            fn2();
            expect(err).toBe(error1);

            return superposition3;
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn3();

            return superposition2;
          },
          (err: MockRuntimeError) => {
            fn4();
            expect(err).toBe(error1);

            return superposition3;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Promise<Dead Superposition>', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error2);
      });
      const superposition3 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error3);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          () => {
            fn1();

            return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
          },
          (err: MockRuntimeError) => {
            fn2();
            expect(err).toBe(error1);

            return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn3();

            return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
          },
          (err: MockRuntimeError) => {
            fn4();
            expect(err).toBe(error1);

            return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('instantly accepts once accepted Superposition', async () => {
      const value1 = 2;
      const value2 = 2;

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();
      const fn5 = vi.fn();
      const fn6 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn1();
            expect(v).toBe(value1);

            return superposition2;
          },
          () => {
            fn2();

            return superposition2;
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn3();
            expect(v).toBe(value2);

            return superposition2;
          },
          () => {
            fn4();

            return superposition2;
          }
        )
        .transform<number, MockRuntimeError>(
          (v: number) => {
            fn5();
            expect(v).toBe(value2);

            return superposition2;
          },
          () => {
            fn6();

            return superposition2;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
      expect(fn5.mock.calls).toHaveLength(1);
      expect(fn6.mock.calls).toHaveLength(0);
    });

    it('instantly declines once declined Superposition', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();
      const fn5 = vi.fn();
      const fn6 = vi.fn();

      await superposition1
        .transform<number, MockRuntimeError>(
          () => {
            fn1();

            return superposition2;
          },
          (err: MockRuntimeError) => {
            fn2();
            expect(err).toBe(error1);

            return superposition2;
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn3();

            return superposition2;
          },
          (err: MockRuntimeError) => {
            fn4();
            expect(err).toBe(error2);

            return superposition2;
          }
        )
        .transform<number, MockRuntimeError>(
          () => {
            fn5();

            return superposition2;
          },
          (err: MockRuntimeError) => {
            fn6();
            expect(err).toBe(error2);

            return superposition2;
          }
        )
        .terminate();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
      expect(fn5.mock.calls).toHaveLength(0);
      expect(fn6.mock.calls).toHaveLength(1);
    });

    it('instantly throws once thrown Superposition', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superposition1 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error1);
      });
      const superposition2 = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error2);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const fn4 = vi.fn();
      const fn5 = vi.fn();
      const fn6 = vi.fn();

      await superposition1
        .transform<number>(
          () => {
            fn1();

            return superposition2;
          },
          () => {
            fn2();

            return superposition2;
          }
        )
        .transform<number>(
          () => {
            fn3();

            return superposition2;
          },
          () => {
            fn4();

            return superposition2;
          }
        )
        .transform<number>(
          () => {
            fn5();

            return superposition2;
          },
          () => {
            fn6();

            return superposition2;
          }
        )
        .terminate();

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
      const value = -201;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifAlive((n: number) => {
          fn();
          expect(n).toBe(value);
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifAlive(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifAlive(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      const value = -201;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifDead(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('invokes callback if Superposition is Dead', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifDead((e: MockRuntimeError) => {
          fn();
          expect(e).toBe(error);
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifDead(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      const value = -201;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifContradiction(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifContradiction(() => {
          fn();
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(0);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('invokes callback if Superposition is Contradiction', async () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn = vi.fn();

      const schrodinger = await superposition
        .ifContradiction((e: unknown) => {
          fn();
          expect(e).toBe(error);
        })
        .terminate();

      expect(fn.mock.calls).toHaveLength(1);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('pass', () => {
    it('invokes first callback if Superposition is Alive', () => {
      const value = 2;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

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
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

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
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

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
      const value = 2;

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.accept(value);
      });

      const fn = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes second callback if Superposition is Dead', () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.decline(error);
      });

      const fn = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });

    it('invokes third callback if Superposition is Contradiction', () => {
      const error = new MockRuntimeError('');

      const superposition = SuperpositionInternal.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(error);
      });

      const fn = vi.fn();

      superposition.peek(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});

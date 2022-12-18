import { MockRuntimeError } from '@jamashita/anden/error';
import { Resolve } from '@jamashita/anden/type';
import { Mock } from 'vitest';
import { Absent, Present } from '../../../heisenberg/index.js';
import { Epoque } from '../../Epoque.js';
import { MockEpoque } from '../../mock/MockEpoque.js';
import { Unscharferelation } from '../../Unscharferelation.js';
import { AbsentPlan } from '../AbsentPlan.js';

describe('AbsentPlan', () => {
  describe('onRecover', () => {
    it('invokes first callback when P given', async () => {
      const value: number = 10;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return value - 6;
          },
          new MockEpoque(
            (n: number) => {
              fn2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<P> given', async () => {
      const value: number = 10;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Promise.resolve(value - 6);
          },
          new MockEpoque(
            (n: number) => {
              fn2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Present Unscharferelation given', async () => {
      const value: number = 10;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Unscharferelation.ofHeisenberg(Present.of(value - 6));
          },
          new MockEpoque(
            (n: number) => {
              fn2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Promise<Present Unscharferelation> given', async () => {
      const value: number = 10;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Promise.resolve(Unscharferelation.of((e: Epoque<number>) => {
              return e.accept(value - 6);
            }));
          },
          new MockEpoque(
            (n: number) => {
              fn2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            () => {
              fn4();

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when null given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return null;
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when undefined given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return undefined;
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<null> given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve(null);
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<undefined> given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve(undefined);
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Absent Unscharferelation given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Unscharferelation.ofHeisenberg(Absent.of());
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<Absent Unscharferelation> given', async () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Promise.resolve(Unscharferelation.ofHeisenberg(Absent.of()));
          },
          new MockEpoque(
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
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            throw error;
          },
          new MockEpoque(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            (n: unknown) => {
              fn4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Promise.reject<number>(error);
          },
          new MockEpoque(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            (n: unknown) => {
              fn4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Lost Unscharferelation given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Unscharferelation.of((e: Epoque<number>) => {
              return e.throw(error);
            });
          },
          new MockEpoque(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            (n: unknown) => {
              fn4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Promise<Lost Unscharferelation> given', async () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();
      const fn4: Mock = vi.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of(
          () => {
            fn1();

            return Promise.resolve(Unscharferelation.of((e: Epoque<number>) => {
              return e.throw(error);
            }));
          },
          new MockEpoque(
            () => {
              fn2();

              resolve();
            },
            () => {
              fn3();

              resolve();
            },
            (n: unknown) => {
              fn4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onRecover();
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });
  });
});

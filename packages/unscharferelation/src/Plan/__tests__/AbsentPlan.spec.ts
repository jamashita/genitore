import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { Epoque } from '../../Epoque';
import { MockEpoque } from '../../mock/MockEpoque';
import { Unscharferelation } from '../../Unscharferelation';
import { AbsentPlan } from '../AbsentPlan';

describe('AbsentPlan', () => {
  describe('onRecover', () => {
    it('invokes first callback when P given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
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

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<number>(value - 6);
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

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Unscharferelation.present<number>(value - 6);
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

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.of<number>((e: Epoque<number>) => {
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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<null>(null);
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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<undefined>(undefined);
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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Unscharferelation.absent<number>();
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
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.absent<number>());
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
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
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
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.reject(error);
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
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Unscharferelation.of<number>((e: Epoque<number>) => {
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
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            fn1();

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.of<number>((e: Epoque<number>) => {
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

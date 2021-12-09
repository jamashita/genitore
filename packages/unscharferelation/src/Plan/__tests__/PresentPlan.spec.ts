import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { Epoque } from '../../Epoque';
import { MockEpoque } from '../../Mock/MockEpoque';
import { Unscharferelation } from '../../Unscharferelation';
import { PresentPlan } from '../PresentPlan';

describe('PresentPlan', () => {
  describe('onMap', () => {
    it('invokes first callback when P given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return n - 6;
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
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

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 6);
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes first callback when Present Unscharfeleration given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Unscharferelation.present<number>(value - 6);
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
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

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.present<number>(value - 6));
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when null given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return null;
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when undefined given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return undefined;
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<null> given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.resolve<null>(null);
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<undefined> given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          () => {
            fn1();

            return Promise.resolve<undefined>(undefined);
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Absent Unscharferelation given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Unscharferelation.absent<number>();
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes second callback when Promise<Absent Unscharferelation> given', async () => {
      const value: number = 10;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.absent<number>());
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
      expect(fn4.mock.calls).toHaveLength(0);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            throw error;
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.reject<number>(error);
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Lost Unscharferelation given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.throw(error);
            });
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });

    it('invokes third callback when Promise<Lost Unscharferelation> given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();
      const fn4: jest.Mock = jest.fn();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            fn1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.throw(error);
            }));
          },
          new MockEpoque<number>(
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

        plan.onMap(value);
      });

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
      expect(fn4.mock.calls).toHaveLength(1);
    });
  });
});

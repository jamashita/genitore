import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { SinonSpy, spy } from 'sinon';
import { Epoque } from '../../Epoque';
import { MockEpoque } from '../../Mock/MockEpoque';
import { Unscharferelation } from '../../Unscharferelation';
import { PresentPlan } from '../PresentPlan';

describe('PresentPlan', () => {
  describe('onMap', () => {
    it('invokes first callback when P given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return n - 6;
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 6);
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Present Unscharfeleration given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.present<number>(value - 6);
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<Present Unscharferelation> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.present<number>(value - 6));
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when null given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return null;
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when undefined given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return undefined;
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Promise<null> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<null>(null);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Promise<undefined> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          () => {
            spy1();

            return Promise.resolve<undefined>(undefined);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Absent Unscharferelation given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.absent<number>();
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Promise<Absent Unscharferelation> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.absent<number>());
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            throw error;
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.reject<number>(error);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Lost Unscharferelation given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.throw(error);
            });
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Promise<Lost Unscharferelation> given', async () => {
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.throw(error);
            }));
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});

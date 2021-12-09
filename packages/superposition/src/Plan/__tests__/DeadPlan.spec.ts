import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { SinonSpy, spy } from 'sinon';
import { Chrono } from '../../Chrono';
import { MockChrono } from '../../Mock/MockChrono';
import { Superposition } from '../../Superposition';
import { DeadPlan } from '../DeadPlan';

describe('DeadPlan', () => {
  describe('onRecover', () => {
    it('invokes first callback when A given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return value;
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<A> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<number>(value);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Alive Superposition given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.alive<number, MockRuntimeError>(value);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<Alive Superposition> given', async () => {
      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.alive<number, MockRuntimeError>(value));
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when D thrown', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            throw error;
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when rejected Promise<A> given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Dead Superposition given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError);
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Promise<Dead Superposition given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError));
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            throw error;
          },
          new MockChrono<number, MockRuntimeError>(
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
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when an unexpected rejected Promise given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono<number, MockRuntimeError>(
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
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Contradiction Superposition given', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
        (e: MockRuntimeError) => {
          spy1();
          expect(e).toBe(error);

          return Superposition.of<number, MockRuntimeError>((c: Chrono<number, MockRuntimeError>) => {
            return c.throw(error);
          });
        },
        new MockChrono<number, MockRuntimeError>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          },
          new Set<DeadConstructor<MockRuntimeError>>()
        )
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Promise<Contradiction Superposition> given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.of<number, MockRuntimeError>((c: Chrono<number, MockRuntimeError>) => {
              return c.throw(error);
            }));
          },
          new MockChrono<number, MockRuntimeError>(
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
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});

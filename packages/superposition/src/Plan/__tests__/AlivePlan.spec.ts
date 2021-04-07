import { MockRuntimeError } from '@jamashita/anden-error';
import { Resolve } from '@jamashita/anden-type';
import sinon, { SinonSpy } from 'sinon';
import { Chrono } from '../../Chrono/Interface/Chrono';
import { MockChrono } from '../../Chrono/Mock/MockChrono';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { Superposition } from '../../Superposition';
import { AlivePlan } from '../AlivePlan';

describe('AlivePlan', () => {
  describe('onMap', () => {
    it('invokes first callback when A given', async () => {
      expect.assertions(6);

      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return n - 1;
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 1);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<A> given', async () => {
      expect.assertions(6);

      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 2);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 2);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Alive Superposition given', async () => {
      expect.assertions(6);

      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Superposition.alive<number, MockRuntimeError>(n - 3);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 3);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Promise<Alive Superposition> given', async () => {
      expect.assertions(6);

      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.alive<number, MockRuntimeError>(n - 3));
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 3);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when D thrown', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when rejected Promise<A> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Dead Superposition given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Promise<Dead Superposition> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes third callback when an unexpected error thrown', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>()
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
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Contradiction Superposition given', () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

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
          (e: unknown) => {
            spy4();
            expect(e).toBe(error);
          },
          new Set<DeadConstructor<MockRuntimeError>>()
        )
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes third callback when Promise<Contradiction Superposition> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockRuntimeError> = AlivePlan.of<number, number, MockRuntimeError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>()
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

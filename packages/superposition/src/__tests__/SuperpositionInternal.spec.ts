import { MockRuntimeError } from '@jamashita/anden-error';
import { Plan } from '@jamashita/genitore-plan';
import { Detoxicated, Schrodinger } from '@jamashita/genitore-schrodinger';
import { SinonSpy, spy } from 'sinon';
import { Chrono } from '../Chrono';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('SuperpositionInternal', () => {
  describe('toString', () => {
    it('returns its retaining Schrodinger string', () => {
      expect.assertions(3);

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        [MockRuntimeError]
      );

      expect(superposition1.toString()).toBe('Alive: -1');
      expect(superposition2.toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
      expect(superposition3.toString()).toBe('Contradiction: null');
    });
  });

  describe('accept', () => {
    it('does nothing if done once', async () => {
      expect.assertions(4);

      const value: number = -35;
      const s: SinonSpy = spy();
      const plans: Set<Plan<Detoxicated<number>, MockRuntimeError>> = new Set<Plan<Detoxicated<number>, MockRuntimeError>>();

      plans.forEach = spy;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger1.get()).toBe(value);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(s.called).toBe(false);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all maps', async () => {
      expect.assertions(4);

      const value: number = -1.3;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await superposition.map<number>((v: number) => {
        spy2();
        expect(v).toBe(value);

        return v + 3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('decline', () => {
    it('does nothing if done once', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();
      const s: SinonSpy = spy();
      const plans: Set<Plan<Detoxicated<number>, MockRuntimeError>> = new Set<Plan<Detoxicated<number>, MockRuntimeError>>();

      plans.forEach = spy;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.decline(error);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(s.called).toBe(false);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all recovers', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      await superposition.recover<number, MockRuntimeError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy2();

        return 3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('throw', () => {
    it('does nothing if done once', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();
      const s: SinonSpy = spy();
      const plans: Set<Plan<Detoxicated<number>, void>> = new Set<Plan<Detoxicated<number>, void>>();

      plans.forEach = spy;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      // @ts-expect-error
      superposition.plans = plans;

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isContradiction()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(error);

      superposition.throw(error);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(s.called).toBe(false);
      expect(schrodinger1).toBe(schrodinger2);
    });

    it('invokes all throws', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await superposition.map<number, MockRuntimeError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy2();

        return 3;
      }).terminate();

      await superposition.map<number, MockRuntimeError>(() => {
        spy3();

        return 2;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy4();

        return 1;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      expect.assertions(3);

      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await expect(superposition1.get()).resolves.toStrictEqual(value);
      await expect(superposition2.get()).rejects.toThrow(error);
      await expect(superposition3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass instance', async () => {
      expect.assertions(6);

      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      ).terminate();
      const dead: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      ).terminate();
      const contradiction: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      ).terminate();

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
      expect.assertions(6);

      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return v + 1;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise', async () => {
      expect.assertions(6);

      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 2);
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Alive Superposition', async () => {
      expect.assertions(5);

      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Dead nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      expect.assertions(5);

      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks when a callback throws Dead error', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns rejected Promise Dead', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition4;
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        spy4();

        return superposition4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        spy4();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('instantly accepts once accepted Superposition', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 20;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly declines once declined Superposition', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy3();

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly throws once thrown Superposition', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition2;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('invokes callbacks unless it is not Alive nor Contradiction', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();

        return v + 1;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();

        return Promise.resolve<number>(v + 1);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return Promise.resolve<number>(value + 13);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return Promise.resolve<number>(v + 130);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Alive Superposition', async () => {
      expect.assertions(5);

      const value1: number = 2;
      const value2: number = 20;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>(() => {
        spy1();

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Alive nor Contradiction, even if the return value is Promise<Alive Superposition>', async () => {
      expect.assertions(5);

      const value1: number = 2;
      const value2: number = 20;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>(() => {
        spy1();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks when a callback throws Dead error', async () => {
      expect.assertions(6);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy1();
        expect(err).toBe(error1);

        throw error2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks when a callback returns rejected Promise Dead', async () => {
      expect.assertions(6);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy1();
        expect(err).toBe(error1);

        return Promise.reject<number>(error2);
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks when a callback returns Dead Superposition', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error1);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Dead Superposition>', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error1);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return value + 130;
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        return value + 13;
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns unexpected rejected Promise', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Contradiction Superposition', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Contradiction Superposition>', async () => {
      expect.assertions(5);

      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition4);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('instantly accepts once accepted Superposition', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly declines once declined Superposition', async () => {
      expect.assertions(6);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy3();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly throws once thrown Superposition', async () => {
      expect.assertions(4);

      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(error);

        return superposition2;
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('transform', () => {
    it('invokes first callback when Superposition is Alive', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return value2;
        },
        () => {
          spy2();

          return value3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return value2;
        },
        () => {
          spy4();

          return value3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy2();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy4();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Alive Superposition', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes first callback when Superposition is Alive even if the returns value is Promise<Alive Superposition>', async () => {
      expect.assertions(6);

      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        () => {
          spy2();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        () => {
          spy4();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Superposition is Dead', async () => {
      expect.assertions(5);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          spy1();

          throw error2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          throw error3;
        }
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          throw error2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          throw error3;
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('invokes second callback when Superposition is Dead even if the return value is rejected Promise', async () => {
      expect.assertions(6);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Dead Superposition', async () => {
      expect.assertions(6);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('invokes second callback when Superposition is Dead even if the return value is Promise<Dead Superposition>', async () => {
      expect.assertions(6);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition2);
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          return Promise.resolve<SuperpositionInternal<number, MockRuntimeError>>(superposition3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('instantly accepts once accepted Superposition', async () => {
      expect.assertions(9);

      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();
      const spy5: SinonSpy = spy();
      const spy6: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy5();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(true);
      expect(spy6.called).toBe(false);
    });

    it('instantly declines once declined Superposition', async () => {
      expect.assertions(9);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();
      const spy5: SinonSpy = spy();
      const spy6: SinonSpy = spy();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy5();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy6();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(true);
    });

    it('instantly throws once thrown Superposition', async () => {
      expect.assertions(6);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();
      const spy4: SinonSpy = spy();
      const spy5: SinonSpy = spy();
      const spy6: SinonSpy = spy();

      await superposition1.transform<number>(
        () => {
          spy1();

          return superposition2;
        },
        () => {
          spy2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          spy3();

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          spy5();

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('invokes callback if Superposition is Alive', async () => {
      expect.assertions(3);

      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive((n: number) => {
        s();
        expect(n).toBe(value);
      }).terminate();

      expect(s.called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifAlive(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      expect.assertions(2);

      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('invokes callback if Superposition is Dead', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead((e: MockRuntimeError) => {
        s();
        expect(e).toBe(error);
      }).terminate();

      expect(s.called).toBe(true);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('does not invoke callback if Superposition is Contradiction', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifDead(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('does not invoke callback if Superposition is Alive', async () => {
      expect.assertions(2);

      const value: number = -201;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('does not invoke callback if Superposition is Dead', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction(() => {
        s();
      }).terminate();

      expect(s.called).toBe(false);
      expect(schrodinger.isDead()).toBe(true);
    });

    it('invokes callback if Superposition is Contradiction', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.ifContradiction((e: unknown) => {
        s();
        expect(e).toBe(error);
      }).terminate();

      expect(s.called).toBe(true);
      expect(schrodinger.isContradiction()).toBe(true);
    });
  });

  describe('pass', () => {
    it('invokes first callback if Superposition is Alive', () => {
      expect.assertions(4);

      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      superposition.pass(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('invokes second callback if Superposition is Dead', () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      superposition.pass(
        () => {
          spy1();
        },
        (e: MockRuntimeError) => {
          spy2();
          expect(e).toBe(error);
        },
        () => {
          spy3();
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('invokes third callback if Superposition is Contradiction', () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      superposition.pass(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (e: unknown) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });

  describe('peek', () => {
    it('invokes first callback if Superposition is Alive', () => {
      expect.assertions(1);

      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      superposition.peek(() => {
        s();
      });

      expect(s.called).toBe(true);
    });

    it('invokes second callback if Superposition is Dead', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      superposition.peek(() => {
        s();
      });

      expect(s.called).toBe(true);
    });

    it('invokes third callback if Superposition is Contradiction', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const s: SinonSpy = spy();

      superposition.peek(() => {
        s();
      });

      expect(s.called).toBe(true);
    });
  });
});


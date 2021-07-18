import { MockRuntimeError } from '@jamashita/anden-error';
import { Heisenberg, Matter } from '@jamashita/genitore-heisenberg';
import { Plan } from '@jamashita/genitore-plan';
import sinon, { SinonSpy } from 'sinon';
import { Epoque } from '../Epoque.js';
import { UnscharferelationError } from '../Error/UnscharferelationError.js';
import { UnscharferelationInternal } from '../UnscharferelationInternal.js';

describe('UnscharferelationInternal', () => {
  describe('toString', () => {
    it('returns its retaining Heisenberg string', () => {
      expect.assertions(3);

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
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
      expect.assertions(4);

      const value: number = -35;
      const spy: SinonSpy = sinon.spy();
      const plans: Set<Plan<Matter<number>, void>> = new Set<Plan<Matter<number>, void>>();

      plans.forEach = spy;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
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

      expect(spy.called).toBe(false);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      expect.assertions(4);

      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await unscharferelation.map<number>((v: number) => {
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

      const spy: SinonSpy = sinon.spy();
      const plans: Set<Plan<Matter<number>, void>> = new Set<Plan<Matter<number>, void>>();

      plans.forEach = spy;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
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

      expect(spy.called).toBe(false);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      expect.assertions(2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      await unscharferelation.recover<number>(() => {
        spy1();

        return 4;
      }).terminate();

      await unscharferelation.recover<number>(() => {
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
      const spy: SinonSpy = sinon.spy();
      const plans: Set<Plan<Matter<number>, void>> = new Set<Plan<Matter<number>, void>>();

      plans.forEach = spy;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
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

      expect(spy.callCount).toBe(0);
      expect(heisenberg1).toBe(heisenberg2);
    });

    it('invokes all maps', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      await unscharferelation.map<number>(() => {
        spy1();

        return 4;
      }).terminate();

      await unscharferelation.recover<number>(() => {
        spy2();

        return 3;
      }).terminate();

      await unscharferelation.map<number>(() => {
        spy3();

        return 2;
      }).terminate();

      await unscharferelation.recover<number>(() => {
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

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
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
      expect.assertions(6);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const present: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.accept(value);
      }).terminate();
      const absent: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.decline();
      }).terminate();
      const lost: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.throw(error);
      }).terminate();

      expect(present.isPresent()).toBe(true);
      expect(present.get()).toBe(value);
      expect(absent.isAbsent()).toBe(true);
      expect(() => {
        absent.get();
      }).toThrow(UnscharferelationError);
      expect(lost.isLost()).toBe(true);
      expect(() => {
        lost.get();
      }).toThrow(error);
    });
  });

  describe('map', () => {
    it('invokes callbacks unless it is not Absent nor Lost', async () => {
      expect.assertions(6);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return v + 1;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Promise', async () => {
      expect.assertions(6);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 1);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Present Unscharferelation', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Absent nor Lost, even if the return value is Promise<Present Unscharferelation>', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks when a callback returns null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return null;
      }).map<number>(() => {
        spy2();

        return null;
      }).map<number>(() => {
        spy3();

        return null;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<null>', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<null>(null);
      }).map<number>(() => {
        spy2();

        return Promise.resolve<null>(null);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<null>(null);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Absent Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Absent Unscharferelation>', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).map<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks when a callback throws unexpected error', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number>(() => {
        spy2();

        throw error;
      }).map<number>(() => {
        spy3();

        throw error;
      }).recover<number>(() => {
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

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy2();

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy3();

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy4();

        return Promise.reject<null>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Lost Unscharferelation', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation4;
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks when a callback returns Promise<Lost Unscharferelation>', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -220;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly accepts once accepted Unscharferelation', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly declines once declined Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).recover<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly throws once declined Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).map<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('invokes callbacks unless it is not Present nor Lost', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();

        return v + 1;
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Promise', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();

        return Promise.resolve<number>(v + 23);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<number>(value + 23);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return Promise.resolve<number>(value + 23);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Present Unscharferelation', async () => {
      expect.assertions(4);

      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>(() => {
        spy1();

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('invokes callbacks unless it is not Present nor Lost, even if the return value is Promise<Present Unscharferelation>', async () => {
      expect.assertions(4);

      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>(() => {
        spy1();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks with a callback returns null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.recover<number>(() => {
        spy1();

        return null;
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('will not invoke callbacks with a callback returns Promise<null>', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.recover<number>(() => {
        spy1();

        return Promise.resolve<null>(null);
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('will not invoke callbacks with a callback returns Absent Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks with a callback returns Promise<Absent Unscharferelation>', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('will not invoke callbacks with a callback throws unexpected error', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).recover<number>(() => {
        spy2();

        throw error;
      }).map<number>(() => {
        spy3();

        throw error;
      }).recover<number>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks with a callback throws unexpected rejected Promise', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy2();

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy3();

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks with a callback returns Lost Unscharferelation', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation4;
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('will not invoke callbacks with a callback returns Promise<Lost Unscharferelation>', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('instantly accepts once accepted Unscharferelation', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly declines once declined Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).recover<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('instantly throws once thrown Unscharferelation', async () => {
      expect.assertions(4);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).map<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('invokes callback if Unscharferelation is Present', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent((v: number) => {
        spy();
        expect(v).toBe(value);
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isPresent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Absent', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Lost', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('does not invoke callback if Unscharferelation is Present', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('invokes callback if Unscharferelation is Absent', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('does not invoke callback if Unscharferelation is Lost', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('does not invoke callback if Unscharferelation is Present', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('does not invoke callback if Unscharferelation is Absent', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('invokes callback if Unscharferelation is Lost', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost((e: unknown) => {
        spy();
        expect(e).toBe(error);
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('pass', () => {
    it('invokes first callback if Unscharferelation is Present', () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
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

    it('invokes second callback if Unscharferelation is Absent', () => {
      expect.assertions(3);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('invokes third callback if Unscharferelation is Lost', () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
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
    it('invokes first callback if Unscharferelation is Present', () => {
      expect.assertions(1);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('invokes second callback if Unscharferelation is Absent', () => {
      expect.assertions(1);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('invokes third callback if Unscharferelation is Lost', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });
});

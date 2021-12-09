import { MockRuntimeError } from '@jamashita/anden-error';
import { Absent, Heisenberg, HeisenbergError, Lost, Present, Uncertain } from '@jamashita/genitore-heisenberg';
import { SinonSpy, spy } from 'sinon';
import { Epoque } from '../Epoque';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { MockUnscharferelation } from '../Mock/MockUnscharferelation';
import { Unscharferelation } from '../Unscharferelation';

describe('Unscharferelation', () => {
  describe('all', () => {
    it('returns Present Unscharferelation with empty array when empty array given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toHaveLength(unscharferelations.length);
    });

    it('returns Present Unscharferelation when Present Unscharferelations given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(0),
        Unscharferelation.present<number>(1),
        Unscharferelation.present<number>(2)
      ];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('returns Absent Unscharferelation sync Unscharferelations which first one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(1),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which second one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(1),
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which last one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(0),
        Unscharferelation.present<number>(1),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when sync Unscharferelations which contains Lost given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(0),
        Unscharferelation.of((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Lost Unscharferelation when sync Unscharferelations which contains Lost given even if all of others are Absent', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(),
        Unscharferelation.of((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Present Unscharferelation when async Present Unscharferelations given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('returns Absent Unscharferelation when async Unscharferelations which first one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which second one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which last one is Absent given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given even if all of others are Absent', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation if includes at least one Lost comes faster than Absent', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.of<number>((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Lost Unscharferelation if includes at least one Lost comes later than Absent', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.of<number>((epoque: Epoque<number>) => {
          setImmediate(() => {
            epoque.throw(error);
          });
        }),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });

  describe('anyway', () => {
    it('returns Present Heisenbergs', async () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present<number>(-1);
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.present<number>(0);
      const unscharferelation3: Unscharferelation<number> = Unscharferelation.present<number>(1);
      const unscharferelations: Array<Unscharferelation<number>> = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs: Array<Heisenberg<number>> = await Unscharferelation.anyway<number>(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < unscharferelations.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        expect(h.get()).toBe(i - 1);
      }
    });

    it('returns Absent Heisenbergs', async () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.absent<number>();
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.absent<number>();
      const unscharferelation3: Unscharferelation<number> = Unscharferelation.absent<number>();
      const unscharferelations: Array<Unscharferelation<number>> = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs: Array<Heisenberg<number>> = await Unscharferelation.anyway<number>(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < unscharferelations.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        expect(() => {
          h.get();
        }).toThrow(HeisenbergError);
      }
    });

    it('returns Lost Heisenbergs', async () => {
      const losts: Array<unknown> = [
        null,
        undefined,
        NaN
      ];

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.of<number>((epoque: Epoque<number>) => {
        epoque.throw(null);
      });
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.of<number>((epoque: Epoque<number>) => {
        epoque.throw(undefined);
      });
      const unscharferelation3: Unscharferelation<number> = Unscharferelation.of<number>((epoque: Epoque<number>) => {
        epoque.throw(NaN);
      });
      const unscharferelations: Array<Unscharferelation<number>> = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs: Array<Heisenberg<number>> = await Unscharferelation.anyway<number>(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < unscharferelations.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        if (h.isLost()) {
          expect(h.getCause()).toBe(losts[i]);
        }
      }
    });

    it('returns All Settled Heisenbergs', async () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.of<number>((epoque: Epoque<number>) => {
        epoque.throw(null);
      });
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.absent<number>();
      const unscharferelation3: Unscharferelation<number> = Unscharferelation.present<number>(1);
      const unscharferelations: Array<Unscharferelation<number>> = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs: Array<Heisenberg<number>> = await Unscharferelation.anyway<number>(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i: number = 0; i < unscharferelations.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const u: Unscharferelation<number> = unscharferelations[i]!;
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await u.terminate();

        switch (i) {
          case 0: {
            if (h.isLost()) {
              expect(h.getCause()).toBeNull();
            }
            continue;
          }
          case 1: {
            expect(() => {
              h.get();
            }).toThrow(HeisenbergError);
            continue;
          }
          case 2:
          default: {
            expect(h.get()).toBe(1);
          }
        }
      }
    });
  });

  describe('maybe', () => {
    it('returns Present Unscharferelation if a value is not null nor undefined', async () => {
      expect(await Unscharferelation.maybe(1).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('a').terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('').terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(true).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(false).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Symbol()).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(1n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(-1n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe({}).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(new Error()).terminate()).toBeInstanceOf(Present);
    });

    it('returns Absent Unscharferelation if a value is null or undefined', async () => {
      expect(await Unscharferelation.maybe(null).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(undefined).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Present Unscharferelation if a Promise is returned', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(1)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve('a')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve('')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(true)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(false)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(Symbol())).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(-1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve({})).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(new Error())).terminate()).toBeInstanceOf(Present);
    });

    it('returns Absent Unscharferelation if null or undefined is returned', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(null)).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined)).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Lost Unscharferelation if an unexpected rejected Promise is returned', async () => {
      expect(await Unscharferelation.maybe(Promise.reject(new MockRuntimeError())).terminate()).toBeInstanceOf(Lost);
    });
  });

  describe('ofHeisenberg', () => {
    it('constructs from Present Unscharferelation', async () => {
      const value: number = 2;
      const present: Present<number> = Present.of<number>(value);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(present);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(present);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('constructs from Absent Unscharferelation', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(absent);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('constructs from Lost Unscharferelation', async () => {
      const lost: Lost<number> = Lost.of<number>(null);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(lost);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(lost);
      expect(heisenberg.isLost()).toBe(true);
      if (heisenberg.isLost()) {
        expect(heisenberg.getCause()).toBeNull();
      }
    });

    it('constructs from Uncertain Unscharferelation', async () => {
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(uncertain);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(uncertain);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('present', () => {
    it('constructs from sync value', async () => {
      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(value);
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('constructs from async value', async () => {
      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(Promise.resolve<number>(value));
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('returns Lost Unscharferelation if rejected Promise given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const present: Unscharferelation<number> = Unscharferelation.present<number>(Promise.reject<number>(error));
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });

  describe('absent', () => {
    it('constructs from sync null or undefined', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.absent<number>();
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('constructs from async null or undefined', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.absent<number>(Promise.resolve<null>(null));
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation if an unexpected rejected Promise given', async () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const absent: Unscharferelation<number> = Unscharferelation.absent<number>(Promise.reject<null>(error));
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });

  describe('toString', () => {
    it('returns its retaining Heisenberg string', () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present<number>(-1);
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.absent<number>();
      const unscharferelation3: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(null);
        }
      );

      expect(unscharferelation1.toString()).toBe('Present: -1');
      expect(unscharferelation2.toString()).toBe('Absent');
      expect(unscharferelation3.toString()).toBe('Lost: null');
    });
  });

  describe('get', () => {
    it('delegates inner Unscharferelation', async () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.get = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.get();

      expect(s.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegates inner Unscharferelation', async () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.terminate = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.terminate();

      expect(s.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.map = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.map<number>((v: number) => {
        return v + 2;
      });

      expect(s.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.recover = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.recover(() => {
        return 2;
      });

      expect(s.called).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.ifPresent = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifPresent(() => {
        // NOOP
      });

      expect(s.called).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.ifAbsent = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifAbsent(() => {
        // NOOP
      });

      expect(s.called).toBe(true);
    });
  });
  describe('ifLost', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.ifLost = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifLost(() => {
        // NOOP
      });

      expect(s.called).toBe(true);
    });
  });

  describe('pass', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.pass = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.pass(
        () => {
          return 1;
        },
        () => {
          return 2;
        },
        () => {
          return 3;
        }
      );

      expect(s.called).toBe(true);
    });
  });

  describe('peek', () => {
    it('delegates inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const s: SinonSpy = spy();

      mock.peek = s;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.peek(() => {
        // NOOP
      });

      expect(s.called).toBe(true);
    });
  });
});

import { MockRuntimeError } from '@jamashita/anden-error';
import sinon, { SinonSpy } from 'sinon';
import { Schrodinger } from '../../superposition/Schrodinger/Schrodinger';
import { Epoque } from '../Epoque/Interface/Epoque';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from '../Heisenberg/Absent';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Lost } from '../Heisenberg/Lost';
import { Present } from '../Heisenberg/Present';
import { Uncertain } from '../Heisenberg/Uncertain';
import { MockUnscharferelation } from '../Mock/MockUnscharferelation';
import { Unscharferelation } from '../Unscharferelation';

describe('Unscharferelation', () => {
  describe('all', () => {
    it('returns Present Unscharferelation with empty array when empty array given', async () => {
      expect.assertions(2);

      const unscharferelations: Array<Unscharferelation<number>> = [];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toHaveLength(unscharferelations.length);
    });

    it('returns Present Unscharferelation when Present Unscharferelations given', async () => {
      expect.assertions(5);

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
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which second one is Absent given', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which last one is Absent given', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Lost Unscharferelation when sync Unscharferelations which contains Lost given', async () => {
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(5);

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
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which second one is Absent given', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which last one is Absent given', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given even if all of others are Absent', async () => {
      expect.assertions(2);

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
      }).toThrow(UnscharferelationError);
    });

    it('returns Lost Unscharferelation if includes at least one Lost comes faster than Absent', async () => {
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(4);

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
      expect.assertions(4);

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
        }).toThrow(UnscharferelationError);
      }
    });

    it('returns Lost Heisenbergs', async () => {
      expect.assertions(4);

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
      expect.assertions(4);

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
            }).toThrow(UnscharferelationError);
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
      expect.assertions(12);

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
      expect.assertions(2);

      expect(await Unscharferelation.maybe(null).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(undefined).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Present Unscharferelation if a Promise is returned', async () => {
      expect.assertions(12);

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
      expect.assertions(2);

      expect(await Unscharferelation.maybe(Promise.resolve(null)).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined)).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Lost Unscharferelation if an unexpected rejected Promise is returned', async () => {
      expect.assertions(1);

      expect(await Unscharferelation.maybe(Promise.reject(new MockRuntimeError())).terminate()).toBeInstanceOf(Lost);
    });
  });

  describe('ofHeisenberg', () => {
    it('constructs from Present Unscharferelation', async () => {
      expect.assertions(3);

      const value: number = 2;
      const present: Present<number> = Present.of<number>(value);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(present);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(present);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('constructs from Absent Unscharferelation', async () => {
      expect.assertions(1);

      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(absent);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('constructs from Lost Unscharferelation', async () => {
      expect.assertions(3);

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
      expect.assertions(2);

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
      expect.assertions(2);

      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(value);
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('constructs from async value', async () => {
      expect.assertions(2);

      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(Promise.resolve<number>(value));
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('returns Lost Unscharferelation if rejected Promise given', async () => {
      expect.assertions(2);

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
      expect.assertions(2);

      const absent: Unscharferelation<number> = Unscharferelation.absent<number>();
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('constructs from async null or undefined', async () => {
      expect.assertions(2);

      const absent: Unscharferelation<number> = Unscharferelation.absent<number>(Promise.resolve<null>(null));
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('returns Lost Unscharferelation if an unexpected rejected Promise given', async () => {
      expect.assertions(2);

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
      expect.assertions(3);

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
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegates inner Unscharferelation', async () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.map = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.map<number>((v: number) => {
        return v + 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.recover = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.recover(() => {
        return 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.ifPresent = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifPresent(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.ifAbsent = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifAbsent(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });
  describe('ifLost', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.ifLost = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifLost(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('pass', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.pass = spy;

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

      expect(spy.called).toBe(true);
    });
  });

  describe('peek', () => {
    it('delegates inner Unscharferelation', () => {
      expect.assertions(1);

      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.peek = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.peek(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('will transform to Alive Superposition if Unscharferelation is Present', async () => {
      expect.assertions(2);

      const value: number = -201;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('will transform to Dead Superposition if the value is error', async () => {
      expect.assertions(2);

      const value: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: Unscharferelation<MockRuntimeError> = Unscharferelation.of<MockRuntimeError>(
        (epoque: Epoque<MockRuntimeError>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<MockRuntimeError, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('will transform to Dead Superposition if Unscharferelation is Absent', async () => {
      expect.assertions(2);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('will transform to Contradiction Superposition if Unscharferelation is Lost', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });
});

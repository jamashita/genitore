import { MockRuntimeError } from '@jamashita/anden/error';
import { Absent, HeisenbergError, Lost, Present, Uncertain } from '../../heisenberg/index.js';
import type { Epoque } from '../Epoque.js';
import { MockUnscharferelation } from '../mock/MockUnscharferelation.js';
import { Unscharferelation } from '../Unscharferelation.js';
import { UnscharferelationError } from '../UnscharferelationError.js';

describe('Unscharferelation', () => {
  describe('all', () => {
    it('returns Present Unscharferelation with empty array when empty array given', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [];

      const heisenberg = await Unscharferelation.all(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toHaveLength(unscharferelations.length);
    });

    it('returns Present Unscharferelation when Present Unscharferelations given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Present.of(0)),
        Unscharferelation.ofHeisenberg(Present.of(1)),
        Unscharferelation.ofHeisenberg(Present.of(2))
      ];

      const heisenberg = await Unscharferelation.all(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array).toHaveLength(unscharferelations.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('returns Absent Unscharferelation sync Unscharferelations which first one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenberg(Present.of(1)),
        Unscharferelation.ofHeisenberg(Present.of(2))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which second one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Present.of(1)),
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenberg(Present.of(2))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation with sync Unscharferelations which last one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Present.of(0)),
        Unscharferelation.ofHeisenberg(Present.of(1)),
        Unscharferelation.ofHeisenberg(Absent.of<number>())
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when sync Unscharferelations which contains Lost given', async () => {
      const error = new MockRuntimeError('');

      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Present.of(0)),
        Unscharferelation.of((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.ofHeisenberg(Present.of(2))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Lost Unscharferelation when sync Unscharferelations which contains Lost given even if all of others are Absent', async () => {
      const error = new MockRuntimeError('');

      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.of((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.ofHeisenberg(Absent.of<number>())
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Present Unscharferelation when async Present Unscharferelations given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(0))),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1))),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const heisenberg = await Unscharferelation.all(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array).toHaveLength(unscharferelations.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('returns Absent Unscharferelation when async Unscharferelations which first one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1))),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which second one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(0))),
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent Unscharferelation when async Unscharferelations which last one is Absent given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(0))),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1))),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Absent.of<number>()))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation when async Unscharferelations which contains Lost given even if all of others are Absent', async () => {
      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1))),
        Unscharferelation.ofHeisenberg(Absent.of<number>())
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost Unscharferelation if includes at least one Lost comes faster than Absent', async () => {
      const error = new MockRuntimeError('');

      const unscharferelations = [
        Unscharferelation.of((epoque: Epoque<number>) => {
          epoque.throw(error);
        }),
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Lost Unscharferelation if includes at least one Lost comes later than Absent', async () => {
      const error = new MockRuntimeError('');

      const unscharferelations = [
        Unscharferelation.ofHeisenberg(Absent.of<number>()),
        Unscharferelation.of((epoque: Epoque<number>) => {
          setImmediate(() => {
            epoque.throw(error);
          });
        }),
        Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(2)))
      ];

      const unscharferelation = Unscharferelation.all(unscharferelations);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });

  describe('anyway', () => {
    it('returns Present Heisenbergs', async () => {
      const unscharferelation1 = Unscharferelation.ofHeisenberg(Present.of(-1));
      const unscharferelation2 = Unscharferelation.ofHeisenberg(Present.of(0));
      const unscharferelation3 = Unscharferelation.ofHeisenberg(Present.of(1));
      const unscharferelations = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs = await Unscharferelation.anyway(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i = 0; i < unscharferelations.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        expect(h.get()).toBe(i - 1);
      }
    });

    it('returns Absent Heisenbergs', async () => {
      const unscharferelation1 = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelation2 = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelation3 = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelations = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs = await Unscharferelation.anyway(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i = 0; i < unscharferelations.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        expect(() => {
          h.get();
        }).toThrow(HeisenbergError);
      }
    });

    it('returns Lost Heisenbergs', async () => {
      const losts: Array<unknown> = [null, undefined, Number.NaN];

      const unscharferelation1 = Unscharferelation.of((epoque: Epoque<number>) => {
        epoque.throw(null);
      });
      const unscharferelation2 = Unscharferelation.of((epoque: Epoque<number>) => {
        epoque.throw(undefined);
      });
      const unscharferelation3 = Unscharferelation.of((epoque: Epoque<number>) => {
        epoque.throw(Number.NaN);
      });
      const unscharferelations = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs = await Unscharferelation.anyway(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i = 0; i < unscharferelations.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        if (h.isLost()) {
          expect(h.getCause()).toBe(losts[i]);
        }
      }
    });

    it('returns All Settled Heisenbergs', async () => {
      const unscharferelation1 = Unscharferelation.of((epoque: Epoque<number>) => {
        epoque.throw(null);
      });
      const unscharferelation2 = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelation3 = Unscharferelation.ofHeisenberg(Present.of(1));
      const unscharferelations = [unscharferelation1, unscharferelation2, unscharferelation3];

      const heisenbergs = await Unscharferelation.anyway(unscharferelations);

      expect(heisenbergs).toHaveLength(unscharferelations.length);
      for (let i = 0; i < unscharferelations.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const u = unscharferelations[i]!;
        const h = await u.terminate();

        switch (i) {
          // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
          case 0: {
            if (h.isLost()) {
              expect(h.getCause()).toBeNull();
            }

            break;
          }
          // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
          case 1: {
            expect(() => {
              h.get();
            }).toThrow(HeisenbergError);

            break;
          }
          default: {
            expect(h.get()).toBe(1);
          }
        }
      }
    });
  });

  describe('maybe', () => {
    it('returns Present Unscharferelation if a value is not null nor undefined', async () => {
      expect(await Unscharferelation.ofHeisenberg(Present.of(1)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(0)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of('a')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of('')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(true)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(false)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(Symbol())).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(0n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(-1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of({})).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenberg(Present.of(new Error())).terminate()).toBeInstanceOf(Present);
    });

    it('returns Absent Unscharferelation if a value is null or undefined', async () => {
      expect(await Unscharferelation.ofHeisenberg(Absent.of()).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Present Unscharferelation if a Promise is returned', async () => {
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(0))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of('a'))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(''))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(true))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(false))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(Symbol()))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(0n))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(1n))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(-1n))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of({}))).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Present.of(new Error()))).terminate()).toBeInstanceOf(Present);
    });

    it('returns Absent Unscharferelation if null or undefined is returned', async () => {
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.resolve(Absent.of())).terminate()).toBeInstanceOf(Absent);
    });

    it('returns Lost Unscharferelation if an unexpected rejected Promise is returned', async () => {
      expect(await Unscharferelation.ofHeisenbergAsync(Promise.reject(Present.of(new MockRuntimeError('')))).terminate()).toBeInstanceOf(Lost);
    });
  });

  describe('ofHeisenberg', () => {
    it('constructs from Present Unscharferelation', async () => {
      const value = 2;
      const present = Present.of(value);

      const unscharferelation = Unscharferelation.ofHeisenberg(present);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(present);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('constructs from Absent Unscharferelation', async () => {
      const absent = Absent.of<number>();

      const unscharferelation = Unscharferelation.ofHeisenberg(absent);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('constructs from Lost Unscharferelation', async () => {
      const lost = Lost.of<number>(null);

      const unscharferelation = Unscharferelation.ofHeisenberg(lost);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(lost);
      expect(heisenberg.isLost()).toBe(true);
      if (heisenberg.isLost()) {
        expect(heisenberg.getCause()).toBeNull();
      }
    });

    it('constructs from Uncertain Unscharferelation', async () => {
      const uncertain = Uncertain.of<number>();

      const unscharferelation = Unscharferelation.ofHeisenberg(uncertain);

      const heisenberg = await unscharferelation.terminate();

      expect(heisenberg).not.toBe(uncertain);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('toString', () => {
    it('returns its retaining Heisenberg string', () => {
      const unscharferelation1 = Unscharferelation.ofHeisenberg(Present.of(-1));
      const unscharferelation2 = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelation3 = Unscharferelation.of((epoque: Epoque<number>) => {
        epoque.throw(null);
      });

      expect(unscharferelation1.toString()).toBe('Present: -1');
      expect(unscharferelation2.toString()).toBe('Absent');
      expect(unscharferelation3.toString()).toBe('Lost: null');
    });
  });

  describe('get', () => {
    it('delegates inner Unscharferelation', async () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.get = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      await unscharferelation.get();

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('terminate', () => {
    it('delegates inner Unscharferelation', async () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.terminate = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      await unscharferelation.terminate();

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('map', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.map = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.map<number>((v: number) => {
        return v + 2;
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('recover', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.recover = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.recover(() => {
        return 2;
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifPresent', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.ifPresent = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.ifPresent(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifAbsent', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.ifAbsent = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.ifAbsent(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
  describe('ifLost', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.ifLost = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.ifLost(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('pass', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.pass = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

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

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('peek', () => {
    it('delegates inner Unscharferelation', () => {
      const mock = new MockUnscharferelation<number>();

      const fn = vi.fn();

      mock.peek = fn;

      const unscharferelation = Unscharferelation.ofUnscharferelation(mock);

      unscharferelation.peek(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});

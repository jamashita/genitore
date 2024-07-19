import { MockRuntimeError } from '@jamashita/anden/error';
import { Alive, Contradiction, Dead, Still } from '../../schrodinger/index.js';
import type { Chrono } from '../Chrono.js';
import { MockSuperposition } from '../mock/MockSuperposition.js';
import { Superposition } from '../Superposition.js';
import { SuperpositionError } from '../SuperpositionError.js';

describe('Superposition', () => {
  describe('all', () => {
    it('returns Alive Superposition with empty array when empty array given', async () => {
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [];

      const schrodinger = await Superposition.all(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(superpositions.length);
    });

    it('returns Alive Superposition when sync Alive Superpositions given', async () => {
      const superpositions = [
        Superposition.ofSchrodinger(Alive.of(0)),
        Superposition.ofSchrodinger(Alive.of(1)),
        Superposition.ofSchrodinger(Alive.of(2))
      ];

      const schrodinger = await Superposition.all(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead Superposition when sync Superpositions which first one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodinger(Dead.of(error)),
        Superposition.ofSchrodinger(Alive.of(1)),
        Superposition.ofSchrodinger(Alive.of(2))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when sync Superpositions which second one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodinger(Alive.of(0)),
        Superposition.ofSchrodinger(Dead.of(error)),
        Superposition.ofSchrodinger(Alive.of(2))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when sync Superpositions which last one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodinger(Alive.of(0)),
        Superposition.ofSchrodinger(Alive.of(1)),
        Superposition.ofSchrodinger(Dead.of(error))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when sync Superpositions which contains Contradiction given', async () => {
      const error = new MockRuntimeError('');

      const superpositions = [
        Superposition.ofSchrodinger(Alive.of(0)),
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }),
        Superposition.ofSchrodinger(Alive.of(2))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when sync Superpositions which contains Contradiction given even if all of others are Dead', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superpositions = [
        Superposition.ofSchrodinger(Dead.of(error1)),
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }),
        Superposition.ofSchrodinger(Dead.of(error3))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });

    it('returns Alive Superposition when async Alive Superpositions given', async () => {
      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(0))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(1))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const schrodinger = await Superposition.all(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead Superposition when async Superpositions which first one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(1))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when async Superpositions which second one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(0))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when async Superpositions which last one is Dead given', async () => {
      const error = new MockRuntimeError('');
      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(0))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(1))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when async Superpositions which contains Contradiction given', async () => {
      const error = new MockRuntimeError('');

      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(0))),
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when async Superpositions which contains Contradiction given even if all of others are Dead', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error1))),
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }),
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error3)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });

    it('returns Contradiction Superposition if includes at least one Contradiction Contradiction comes faster than Dead', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        }),
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error2))),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('returns Contradiction Superposition if includes at least one Contradiction Contradiction comes later than Dead', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');

      const superpositions = [
        Superposition.ofSchrodingerAsync(Promise.resolve(Dead.of(error1))),
        Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }),
        Superposition.ofSchrodingerAsync(Promise.resolve(Alive.of(2)))
      ];

      const superposition = Superposition.all(superpositions);

      const schrodinger = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });

  describe('anyway', () => {
    it('returns Alive Schrodingers', async () => {
      const superposition1 = Superposition.ofSchrodinger(Alive.of(-1));
      const superposition2 = Superposition.ofSchrodinger(Alive.of(0));
      const superposition3 = Superposition.ofSchrodinger(Alive.of(1));
      const superpositions = [superposition1, superposition2, superposition3];

      const schrodingers = await Superposition.anyway(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i = 0; i < superpositions.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        expect(s.get()).toBe(i - 1);
      }
    });

    it('returns Dead Schrodingers', async () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');
      const errors = [error1, error2, error3];

      const superposition1 = Superposition.ofSchrodinger(Dead.of(error1));
      const superposition2 = Superposition.ofSchrodinger(Dead.of(error2));
      const superposition3 = Superposition.ofSchrodinger(Dead.of(error3));
      const superpositions = [superposition1, superposition2, superposition3];

      const schrodingers = await Superposition.anyway(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i = 0; i < superpositions.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        expect(() => {
          s.get();
        }).toThrow(errors[i]);
      }
    });

    it('returns Contradiction Schrodingers', async () => {
      const contradictions: Array<unknown> = [null, undefined, Number.NaN];

      const superposition1 = Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2 = Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(undefined);
      });
      const superposition3 = Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(Number.NaN);
      });
      const superpositions = [superposition1, superposition2, superposition3];

      const schrodingers = await Superposition.anyway(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i = 0; i < superpositions.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        if (s.isContradiction()) {
          expect(s.getCause()).toBe(contradictions[i]);
        }
      }
    });

    it('returns All Settled Schrodingers', async () => {
      const error = new MockRuntimeError('');
      const superposition1 = Superposition.of((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2 = Superposition.ofSchrodinger(Dead.of(new MockRuntimeError('')));
      const superposition3 = Superposition.ofSchrodinger(Alive.of(1));
      const superpositions = [superposition1, superposition2, superposition3];

      const schrodingers = await Superposition.anyway(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i = 0; i < superpositions.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const ss = superpositions[i]!;
        const s = await ss.terminate();

        switch (i) {
          // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
          case 0: {
            if (s.isContradiction()) {
              expect(s.getCause()).toBeNull();
            }

            break;
          }
          // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
          case 1: {
            expect(() => {
              s.get();
            }).toThrow(error);

            break;
          }
          default: {
            expect(s.get()).toBe(1);
          }
        }
      }
    });
  });

  describe('ofSchrodinger', () => {
    it('constructs from Alive Schrodinger', async () => {
      const value = 2;
      const alive = Alive.of<number, MockRuntimeError>(value);

      const superposition = Superposition.ofSchrodinger(alive);

      const schrodinger = await superposition.terminate();

      expect(schrodinger).not.toBe(alive);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('constructs from Dead Schrodinger', async () => {
      const error = new MockRuntimeError('');
      const dead = Dead.of<number, MockRuntimeError>(error);

      const superposition = Superposition.ofSchrodinger(dead);

      const schrodinger = await superposition.terminate();

      expect(schrodinger).not.toBe(dead);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('constructs from Contradiction Schrodinger', async () => {
      const contradiction = Contradiction.of<number, MockRuntimeError>(null);

      const superposition = Superposition.ofSchrodinger(contradiction);

      const schrodinger = await superposition.terminate();

      expect(schrodinger).not.toBe(contradiction);
      expect(schrodinger.isContradiction()).toBe(true);
      if (schrodinger.isContradiction()) {
        expect(schrodinger.getCause()).toBeNull();
      }
    });

    it('constructs from Still Schrodinger', async () => {
      const still = Still.of<number, MockRuntimeError>();

      const superposition = Superposition.ofSchrodinger(still);

      const schrodinger = await superposition.terminate();

      expect(schrodinger).not.toBe(still);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('get', () => {
    it('delegates inner Superposition', async () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.get = fn;

      const superposition = Superposition.ofSuperposition(mock);

      await superposition.get();

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('terminate', () => {
    it('delegates inner Superposition', async () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.terminate = fn;

      const superposition = Superposition.ofSuperposition(mock);

      await superposition.terminate();

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('map', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn1 = vi.fn();

      mock.map = fn1;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.map<number, MockRuntimeError>((v: number) => {
        return v + 2;
      });

      expect(fn1.mock.calls).toHaveLength(1);
    });
  });

  describe('recover', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.recover = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.recover<number, MockRuntimeError>(() => {
        return 2;
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('transform', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.transform = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.transform<number, MockRuntimeError>(
        () => {
          return 2;
        },
        () => {
          return 2;
        }
      );

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifAlive', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.ifAlive = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.ifAlive(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifDead', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.ifDead = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.ifDead(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifContradiction', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.ifContradiction = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.ifContradiction(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('pass', () => {
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.pass = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.pass(
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
    it('delegates inner Superposition', () => {
      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition();

      const fn = vi.fn();

      mock.peek = fn;

      const superposition = Superposition.ofSuperposition(mock);

      superposition.peek(() => {
        // NOOP
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});

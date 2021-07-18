import { MockRuntimeError } from '@jamashita/anden-error';
import { Alive, Contradiction, Dead, Schrodinger, Still } from '@jamashita/genitore-schrodinger';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Chrono } from '../Chrono.js';
import { SuperpositionError } from '../Error/SuperpositionError.js';
import { MockSuperposition } from '../Mock/MockSuperposition.js';
import { Superposition } from '../Superposition.js';

describe('Superposition', () => {
  describe('all', () => {
    it('returns Alive Superposition with empty array when empty array given', async () => {
      expect.assertions(2);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(superpositions.length);
    });

    it('returns Alive Superposition when sync Alive Superpositions given', async () => {
      expect.assertions(5);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead Superposition when sync Superpositions which first one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when sync Superpositions which second one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when sync Superpositions which last one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when sync Superpositions which contains Contradiction given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when sync Superpositions which contains Contradiction given even if all of others are Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error1, MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error3, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });

    it('returns Alive Superposition when async Alive Superpositions given', async () => {
      expect.assertions(5);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead Superposition when async Superpositions which first one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when async Superpositions which second one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead Superposition when async Superpositions which last one is Dead given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when async Superpositions which contains Contradiction given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        }, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition when async Superpositions which contains Contradiction given even if all of others are Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error3), MockRuntimeError)

      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });

    it('returns Contradiction Superposition if includes at least one Contradiction Contradiction comes faster than Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        }, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('returns Contradiction Superposition if includes at least one Contradiction Contradiction comes later than Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });

  describe('anyway', () => {
    it('returns Alive Schrodingers', async () => {
      expect.assertions(4);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(-1);
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(0);
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(1);
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        expect(s.get()).toBe(i - 1);
      }
    });

    it('returns Dead Schrodingers', async () => {
      expect.assertions(4);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();
      const errors: Array<MockRuntimeError> = [error1, error2, error3];

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error1);
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error2);
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error3);
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        expect(() => {
          s.get();
        }).toThrow(errors[i]);
      }
    });

    it('returns Contradiction Schrodingers', async () => {
      expect.assertions(4);

      const contradictions: Array<unknown> = [
        null,
        undefined,
        NaN
      ];

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(undefined);
      });
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(NaN);
      });
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        if (s.isContradiction()) {
          expect(s.getCause()).toBe(contradictions[i]);
        }
      }
    });

    it('returns All Settled Schrodingers', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();
      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError());
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(1);
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ss: Superposition<number, MockRuntimeError> = superpositions[i]!;
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await ss.terminate();

        switch (i) {
          case 0: {
            if (s.isContradiction()) {
              expect(s.getCause()).toBeNull();
            }
            continue;
          }
          case 1: {
            expect(() => {
              s.get();
            }).toThrow(error);
            continue;
          }
          case 2:
          default: {
            expect(s.get()).toBe(1);
          }
        }
      }
    });
  });

  describe('playground', () => {
    it('returns Alive Superposition if a value is returned with no errors', async () => {
      expect.assertions(2);

      const value: number = 2;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return value;
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('returns Dead Superposition if an error is thrown', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        throw error;
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition if an unexpected error is thrown', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        throw error;
      });

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Alive Superposition if a Promise is returned', async () => {
      expect.assertions(2);

      const value: number = 2;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.resolve<number>(value);
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('returns Dead Superposition if a rejected Promise is returned', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.reject<number>(error);
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition if an unexpected rejected Promise is returned', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.reject<number>(error);
      });

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('ofSchrodinger', () => {
    it('constructs from Alive Schrodinger', async () => {
      expect.assertions(3);

      const value: number = 2;
      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(alive, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(alive);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('constructs from Dead Schrodinger', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(dead, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(dead);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('constructs from Contradiction Schrodinger', async () => {
      expect.assertions(3);

      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(contradiction, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(contradiction);
      expect(schrodinger.isContradiction()).toBe(true);
      if (schrodinger.isContradiction()) {
        expect(schrodinger.getCause()).toBeNull();
      }
    });

    it('constructs from Still Schrodinger', async () => {
      expect.assertions(2);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(still, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(still);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('alive', () => {
    it('constructs from sync value', async () => {
      expect.assertions(2);

      const value: number = -6;

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(value, MockRuntimeError);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('constructs from async value', async () => {
      expect.assertions(2);

      const value: number = -6;

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(
        Promise.resolve<number>(value),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('returns Contradiction Superposition if rejected Promise given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('dead', () => {
    it('constructs from sync error', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition if an unexpected error given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('constructs from async error', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.reject<number>(error),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition if an unexpected rejected Promise given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction Superposition if a resolved Promise given', async () => {
      expect.assertions(2);

      const value: number = -6;

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.resolve<number>(value),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('toString', () => {
    it('returns its retaining Schrodinger string', () => {
      expect.assertions(3);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(-1, MockRuntimeError);
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError(), MockRuntimeError);
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        MockRuntimeError
      );

      expect(superposition1.toString()).toBe('Alive: -1');
      expect(superposition2.toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
      expect(superposition3.toString()).toBe('Contradiction: null');
    });
  });

  describe('get', () => {
    it('delegates inner Superposition', async () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      await superposition.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegates inner Superposition', async () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      await superposition.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(2);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();
      const stub: SinonStub = sinon.stub();

      mock.map = spy;
      mock.getErrors = stub;
      stub.returns([]);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.map<number, MockRuntimeError>((v: number) => {
        return v + 2;
      });

      expect(spy.called).toBe(true);
      expect(stub.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.recover = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.recover<number, MockRuntimeError>(() => {
        return 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.transform = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.transform<number, MockRuntimeError>(
        () => {
          return 2;
        },
        () => {
          return 2;
        }
      );

      expect(spy.called).toBe(true);
    });
  });

  describe('ifAlive', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifAlive = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifAlive(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifDead = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifDead(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifContradiction = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifContradiction(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('pass', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.pass = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

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

      expect(spy.called).toBe(true);
    });
  });

  describe('peek', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.peek = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.peek(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });
});

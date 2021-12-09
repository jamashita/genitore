import { SinonSpy, spy } from 'sinon';
import { Absent } from '../Absent';
import { HeisenbergError } from '../Error/HeisenbergError';
import { Heisenberg } from '../Heisenberg';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const absent: Absent<number> = Absent.of<number>();

      expect(() => {
        absent.get();
      }).toThrow(HeisenbergError);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('always returns true', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isLost()).toBe(false);
      expect(absent2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const s: SinonSpy = spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifPresent(() => {
        s();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will be invoked', () => {
      const s: SinonSpy = spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifAbsent(() => {
        s();
      });

      expect(s.called).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const s: SinonSpy = spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifLost(() => {
        s();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Absent', () => {
      expect(Absent.of<number>().toString()).toBe('Absent');
    });
  });
});

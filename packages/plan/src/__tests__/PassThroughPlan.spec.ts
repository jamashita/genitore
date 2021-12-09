import { PassThroughPlan } from '../PassThroughPlan';

describe('PassThroughPlan', () => {
  describe('onMap', () => {
    it('invokes first callback when onMap() called', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
        (v: number) => {
          fn1();
          expect(v).toBe(value);
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );

      epoque.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback when onRecover() called', () => {
      const value: string = 'halt';

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
        () => {
          fn1();
        },
        (v: string) => {
          fn2();
          expect(v).toBe(value);
        },
        () => {
          fn3();
        }
      );

      epoque.onRecover(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onDestroy', () => {
    it('invokes third callback when onDestroy() called', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (n: unknown) => {
          fn3();
          expect(n).toBe(value);
        }
      );

      epoque.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});

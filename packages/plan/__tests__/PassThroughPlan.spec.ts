import sinon, { SinonSpy } from 'sinon';
import { PassThroughPlan } from '../PassThroughPlan.js';

describe('PassThroughPlan', () => {
  describe('onMap', () => {
    it('invokes first callback when onMap() called', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
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

      epoque.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback when onRecover() called', () => {
      expect.assertions(4);

      const value: string = 'halt';

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
        () => {
          spy1();
        },
        (v: string) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );

      epoque.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('invokes third callback when onDestroy() called', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: PassThroughPlan<number, string> = PassThroughPlan.of<number, string>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (n: unknown) => {
          spy3();
          expect(n).toBe(value);
        }
      );

      epoque.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});

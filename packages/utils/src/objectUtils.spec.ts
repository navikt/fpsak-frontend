// noinspection JSUnresolvedVariable
import { expect } from 'chai';

import {
  diff, isEqual, isObject, isObjectEmpty, notNull,
} from './objectUtils';

describe('Object-utils', () => {
  it('skal kaste feil når verdi er null', () => {
    expect(() => notNull(null)).to.throw('Value is null');
  });

  it('skal kaste feil når verdi er undefined', () => {
    expect(() => notNull(undefined)).to.throw('Value is undefined');
  });

  it('skal returnere verdi når den er ulik null og undefined', () => {
    expect(notNull('test')).to.eql('test');
  });

  it('skal returnere false når objekt ikke er tomt', () => {
    const object = { test: 'test' };
    expect(isObjectEmpty(object)).is.false;
  });

  it('skal returnere true når objekt er tomt', () => {
    const object = {};
    expect(isObjectEmpty(object)).is.true;
  });

  it('skal returnere true når objekter er like', () => {
    const object1 = { test: 'test' };
    const object2 = { test: 'test' };
    expect(isEqual(object1, object2)).is.true;
  });

  it('skal returnere false når objekter er ulike', () => {
    const object1 = { test: 'test' };
    const object2 = { test: 'annet' };
    expect(isEqual(object1, object2)).is.false;
  });

  it('skal returnere true når verdi er et object', () => {
    const object = { test: 'test' };
    expect(isObject(object)).is.true;
  });

  it('skal returnere false når verdi ikke er et object', () => {
    const string = 'test';
    expect(isObject(string)).is.false;
  });

  describe('diff', () => {
    it('skal diffe strenger', () => {
      expect(diff('a', 'a')).to.be.false;
      expect(diff('a', 'b')).to.be.true;
    });

    it('skal diffe tall', () => {
      expect(diff(1, 1)).to.be.false;
      expect(diff(1, 2)).to.be.true;
      expect(diff(1, null)).to.be.true;
      expect(diff(null, 2)).to.be.true;
    });

    it('skal diffe boolske verdier', () => {
      expect(diff(true, true)).to.be.false;
      expect(diff(false, true)).to.be.true;
    });

    it('skal diffe funksjoner på referanse', () => {
      const a = () => undefined;
      const b = () => undefined;
      expect(diff(a, a)).to.be.false;
      expect(diff(a, b)).to.be.true;
    });

    it('skal diffe null', () => {
      expect(diff('a', null)).to.be.true;
      expect(diff(null, 0)).to.be.true;
      expect(diff(null, null)).to.be.false;
    });

    describe('arrays', () => {
      it('skal diffe arrays', () => {
        expect(diff(['a'], ['a'])).to.eql([false]);
        expect(diff(['a'], ['b'])).to.eql([true]);
        expect(diff(['a', 'b'], ['a', 'a'])).to.eql([false, true]);
        expect(diff(['a', 'b'], ['a', 'b'])).to.eql([false, false]);
      });

      it('skal diffe arrays av ulik lengde', () => {
        expect(diff(['a', 'b'], ['a'])).to.eql([false, true]);
        expect(diff(['a', 'b', 0], ['a'])).to.eql([false, true, true]);
      });

      it('skal diffe nøstede arrays', () => {
        expect(diff([['a', 'b']], [['a', 'b']])).to.eql([[false, false]]);
        expect(diff([['a', ['b', 'c']]], [['a', ['b', 'd']]])).to.eql([[false, [false, true]]]);
      });

      it('skal diffe mot undefined som om mot tom array', () => {
        expect(diff(['a', 'b'], undefined)).to.eql([true, true]);
        expect(diff(undefined, [['a', 'b']])).to.eql([[true, true]]);
        expect(diff([['a', ['b', 'c']]], [['a', ['b', undefined]]])).to.eql([[false, [false, true]]]);
      });
    });

    describe('objects', () => {
      it('skal diffe objekter', () => {
        expect(diff({ a: 'a' }, { a: 'a' })).to.eql({ a: false });
        expect(diff({ a: 'a' }, { a: 'b' })).to.eql({ a: true });
        expect(diff({ a: 'a' }, { b: 'a' })).to.eql({ a: true, b: true });
        expect(diff({ a: [0, 2] }, { a: [0, 2] })).to.eql({ a: [false, false] });
        expect(diff({ a: [0, 2] }, { a: [0, 3] })).to.eql({ a: [false, true] });
      });

      it('skal diffe mot undefined som om mot tomt object', () => {
        expect(diff({ a: 'a' }, undefined)).to.eql({ a: true });
        expect(diff(undefined, { a: { b: 'c' } })).to.eql({ a: { b: true } });
      });
    });
  });
});

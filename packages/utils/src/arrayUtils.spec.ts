import { expect } from 'chai';

import {
  flatten, haystack, range, without, zip,
} from './arrayUtils';

describe('arrayUtils', () => {
  describe('range', () => {
    it('skal lage en rekkefølge fra og med 0 med lengde \'length\'', () => {
      const rangeZero = range(0);
      const rangeOne = range(1);
      const rangeTwo = range(2);
      const rangeTen = range(10);

      expect(rangeZero).to.eql([]);
      expect(rangeOne).to.eql([0]);
      expect(rangeTwo).to.eql([0, 1]);
      expect(rangeTen).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('zip', () => {
    it('skal sy sammen to lister av lik lengde', () => {
      const zipped = zip([1, 2], ['a', 'b']);

      expect(zipped).to.eql([[1, 'a'], [2, 'b']]);
    });

    it('skal kaste feil hvis listene er av ulik lengde', () => {
      expect(() => zip([1], ['a', 'b'])).to.throw('Arrays given to zip must be of equal length');
    });
  });

  describe('flatten', () => {
    it('skal flate ut en todimensjonal liste', () => {
      const flattened = flatten(zip([1, 2], ['a', 'b']));

      expect(flattened).to.eql([1, 'a', 2, 'b']);
    });
  });

  describe('without', () => {
    it('skal returnere en funksjon som filterer vekk gitte verdier', () => {
      const withoutABC = without('A', 'B', 'C');

      expect(withoutABC(['A', 'B', 'C', 'D'])).to.eql(['D']);
      expect(withoutABC(['A', 'B', 'C', 'a', 'b', 'c'])).to.eql(['a', 'b', 'c']);
      expect(withoutABC(['B', 'B', 'B'])).to.eql([]);
      expect(withoutABC(['x', { b: 'A' }, 1])).to.eql(['x', { b: 'A' }, 1]);
    });
  });

  describe('haystack', () => {
    it('Skal finne verdi i liste B ved å bruke en dynamiske nøkkel fra liste A', () => {
      const listeA = ['A[0].a', 'B[0].b.key'];
      const listeB = {
        Z: {},
        X: {},
        A: [
          {
            a: 'value',
            b: 'value',
          },
        ],
      };
      expect(haystack(listeB, listeA[0])).to.eql('value');
    });
  });
});

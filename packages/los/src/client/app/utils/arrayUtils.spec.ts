import { expect } from 'chai';

import {
  range, haystack,
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

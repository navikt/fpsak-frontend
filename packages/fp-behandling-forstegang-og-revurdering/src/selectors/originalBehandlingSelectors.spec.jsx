import { expect } from 'chai';

import { getResultatstrukturFraOriginalBehandling } from './originalBehandlingSelectors';

describe('originalBehandlingSelectors', () => {
  describe('getResultatstrukturFraOriginalBehandling', () => {
    it('skal hente beregningsresultat for foreldrepenger', () => {
      const isForeldrepenger = true;
      const originalBehandling = {
        'beregningsresultat-foreldrepenger': {
          resultat: 'test',
        },
      };

      const foreldrepengerResultat = getResultatstrukturFraOriginalBehandling.resultFunc(isForeldrepenger, originalBehandling);

      expect(foreldrepengerResultat.resultat).is.eql('test');
    });

    it('skal hente beregningsresultat for engangsstønad', () => {
      const isForeldrepenger = false;
      const originalBehandling = {
        'beregningsresultat-engangsstonad': {
          resultat: 'test',
        },
      };

      const engangsstonadResultat = getResultatstrukturFraOriginalBehandling.resultFunc(isForeldrepenger, originalBehandling);

      expect(engangsstonadResultat.resultat).is.eql('test');
    });

    it('skal ikke kunne hente beregningsresultat for engangsstønad når en har foreldrepenger fagsak', () => {
      const isForeldrepenger = true;
      const originalBehandling = {
        'beregningsresultat-engangsstonad': {
          resultat: 'test',
        },
      };

      const engangsstonadResultat = getResultatstrukturFraOriginalBehandling.resultFunc(isForeldrepenger, originalBehandling);

      expect(engangsstonadResultat).is.undefined;
    });
  });
});

import { expect } from 'chai';

import { getOriginalBehandling, getResultatstrukturFraOriginalBehandling }
  from './originalBehandlingSelectors';

describe('originalBehandlingSelectors', () => {
  describe('getOriginalBehandling', () => {
    it('skal hente originalbehandling når denne er i sync', () => {
      const originalBehandlingId = 1;
      const originalBehandlingData = {
        id: 1,
      };
      const originalBehandlingMeta = {
        params: {
          behandlingId: originalBehandlingId,
        },
      };

      const originalBehandling = getOriginalBehandling.resultFunc(originalBehandlingId, originalBehandlingData, originalBehandlingMeta);

      expect(originalBehandling).is.eql(originalBehandling);
    });

    it('skal ikke hente originalbehandling når denne ikke er i sync', () => {
      const originalBehandlingId = 1;
      const originalBehandlingData = {
        id: 1,
      };
      const originalBehandlingMeta = {
        params: {
          behandlingId: 2,
        },
      };

      const originalBehandling = getOriginalBehandling.resultFunc(originalBehandlingId, originalBehandlingData, originalBehandlingMeta);

      expect(originalBehandling).is.undefined;
    });
  });

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

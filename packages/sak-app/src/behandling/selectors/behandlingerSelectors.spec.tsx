import { expect } from 'chai';

import {
  getBehandlinger, getBehandlingerIds, getNoExistingBehandlinger,
} from './behandlingerSelectors';

describe('behandlingerSelectors', () => {
  describe('getBehandlinger', () => {
    it('skal hente behandlinger når valgt fagsak er lik den sist forespurte fagsak', () => {
      const saksnummer = 1;
      const behandlingerData = [{
        id: 2,
      }];
      const behandlingerMeta = {
        params: {
          saksnummer,
        },
      };

      const behandlinger = getBehandlinger.resultFunc(saksnummer, behandlingerData, behandlingerMeta);

      expect(behandlinger).is.eql(behandlingerData);
    });

    it('skal ikke hente behandlinger når valgt fagsak er ulik den sist forespurte fagsak', () => {
      const saksnummer = 1;
      const behandlingerData = [{
        id: 2,
      }];
      const behandlingerMeta = {
        params: {
          saksnummer: 2,
        },
      };

      const behandlinger = getBehandlinger.resultFunc(saksnummer, behandlingerData, behandlingerMeta);

      expect(behandlinger).is.undefined;
    });
  });

  describe('getBehandlingerIds', () => {
    it('skal hente behandlingsidene', () => {
      const behandlinger = [{
        id: 1,
      }, {
        id: 2,
      }];

      const behandlingerIds = getBehandlingerIds.resultFunc(behandlinger);

      expect(behandlingerIds).is.eql([1, 2]);
    });
  });

  describe('getNoExistingBehandlinger', () => {
    it('skal ikke ha behandlinger', () => {
      const behandlinger = [];
      const zeroBehandlinger = getNoExistingBehandlinger.resultFunc(behandlinger);
      expect(zeroBehandlinger).is.true;
    });

    it('skal ha behandlinger', () => {
      const behandlinger = [{
        id: 1,
        versjon: 10,
      }, {
        id: 2,
        versjon: 11,
      }];

      const zeroBehandlinger = getNoExistingBehandlinger.resultFunc(behandlinger);

      expect(zeroBehandlinger).is.false;
    });
  });
});

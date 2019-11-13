import { expect } from 'chai';

import fpsakApi from './data/fpsakBehandlingApi';
import { format } from './DataFetcherWithCache';

describe('DataFetcherWithCache', () => {
  it('skal formatere navn til simulering', () => {
    const formatertNavn = format(fpsakApi.SIMULERING_RESULTAT.name);
    expect(formatertNavn).to.eql('simuleringResultat');
  });

  it('skal formatere navn til uttak periode', () => {
    const formatertNavn = format(fpsakApi.UTTAK_PERIODE_GRENSE.name);
    expect(formatertNavn).to.eql('uttakPeriodeGrense');
  });
});

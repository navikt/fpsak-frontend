import { expect } from 'chai';

import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';

import { getFilteredReceivedDocuments, reducer } from './duckBehandlingInnsyn';

describe('Innsyn-behandling-reducer', () => {
  it('skal returnere initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      allDocuments: [],
    });
  });

  it('skal filtrere ut duplikate dokumenter', () => {
    const documents = [{
      dokumentId: 1,
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }, {
      dokumentId: 2,
      kommunikasjonsretning: kommunikasjonsretning.UT,
    }, {
      dokumentId: 2,
      kommunikasjonsretning: kommunikasjonsretning.UT,
    }];

    const filteredDocuments = getFilteredReceivedDocuments.resultFunc(documents);

    expect(filteredDocuments).is.eql([{
      dokumentId: 1,
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }, {
      dokumentId: 2,
      kommunikasjonsretning: kommunikasjonsretning.UT,
    }]);
  });
});

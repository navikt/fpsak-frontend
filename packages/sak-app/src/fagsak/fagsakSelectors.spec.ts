import { expect } from 'chai';

import { Fagsak } from '@fpsak-frontend/types';

import { getSelectedFagsak } from './fagsakSelectors';

describe('<fagsakSelectors>', () => {
  it('skal returnere fagsak når valgt saksnummer stemmer overens med hentet fagsak', () => {
    const selectedSaksnummer = 123;
    const fagsak: Partial<Fagsak> = {
      saksnummer: 123,
    };
    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak as Fagsak);
    expect(res).is.eql(fagsak);
  });

  it('skal ikke returnere fagsak når valgt saksnummer er ulik hentet fagsak', () => {
    const selectedSaksnummer = 123;
    const fagsak: Partial<Fagsak> = {
      saksnummer: 456,
    };

    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak as Fagsak);
    expect(res).is.undefined;
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Systemtittel } from 'nav-frontend-typografi';

import TilbakekrevingVedtak from './TilbakekrevingVedtak';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

describe('<TilbakekrevingVedtak>', () => {
  const perioder = [{
    periode: ['2019-10-10', '2019-12-10'],
    feilutbetaltBeløp: 15430,
    vurdering: {
      kode: 'SIMP',
      kodeverk: 'VURDERING',
    },
    andelAvBeløp: 100,
    renterProsent: 10,
    tilbakekrevingBeløp: 15430,
  }, {
    periode: ['2019-05-10', '2019-06-10'],
    feilutbetaltBeløp: 14000,
    vurdering: {
      kode: 'SIMP',
      kodeverk: 'VURDERING',
    },
    andelAvBeløp: 50,
    tilbakekrevingBeløp: 7000,
  }];

  it('skal vise vedtakspanel for tilbakekreving', () => {
    const wrapper = shallow(<TilbakekrevingVedtak
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      resultat={{ kode: 'testresultat' }}
      konsekvensAvBehandling="testkonsekvens"
      perioder={perioder}
      isBehandlingHenlagt={false}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      alleKodeverk={{}}
      avsnittsliste={[]}
      fetchPreviewVedtaksbrev={sinon.spy()}
      aksjonspunktKodeForeslaVedtak="1234"
    />);

    expect(wrapper.find(TilbakekrevingVedtakPeriodeTabell)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingVedtakForm)).to.have.length(1);
    expect(wrapper.find(Systemtittel)).to.have.length(0);
  });
});

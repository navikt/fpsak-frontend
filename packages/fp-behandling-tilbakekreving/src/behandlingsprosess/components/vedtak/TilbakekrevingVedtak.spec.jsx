import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { TilbakekrevingVedtakImpl as TilbakekrevingVedtak } from './TilbakekrevingVedtak';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

describe('<TilbakekrevingVedtak>', () => {
  it('skal vise vedtakspanel for tilbakekreving', () => {
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
    const getKodeverknavn = () => 'Simpel uaktsomhet';

    const wrapper = shallow(<TilbakekrevingVedtak
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      resultat={{ kode: 'testresultat' }}
      konsekvensAvBehandling="testkonsekvens"
      perioder={perioder}
      getKodeverknavn={getKodeverknavn}
    />);

    expect(wrapper.find(TilbakekrevingVedtakPeriodeTabell)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingVedtakForm)).to.have.length(1);
  });
});

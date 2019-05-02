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
      fomDato: '2019-10-10',
      tomDato: '2019-12-10',
      feilUtbetaltBelop: 15430,
      vurdering: 'Simpel uaktsomhet',
      andelAvBelop: 100,
      belopSomTilbakekreves: 15430,
    }, {
      fomDato: '2019-05-10',
      tomDato: '2019-06-10',
      feilUtbetaltBelop: 14000,
      vurdering: 'Simpel uaktsomhet',
      andelAvBelop: 50,
      belopSomTilbakekreves: 7000,
    }];
    const wrapper = shallow(<TilbakekrevingVedtak
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      resultat="testresultat"
      konsekvensAvBehandling="testkonsekvens"
      perioder={perioder}
    />);

    expect(wrapper.find(TilbakekrevingVedtakPeriodeTabell)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingVedtakForm)).to.have.length(1);
  });
});

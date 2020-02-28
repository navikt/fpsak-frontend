import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import SkjeringspunktOgStatusPanel, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN, SkjeringspunktOgStatusPanelImpl } from './SkjeringspunktOgStatusPanel';

const skjeringstidspunktDato = '2017-12-12';
const aktivitetstatusList = [{
  kode: aktivitetStatus.ARBEIDSTAKER,
}, {
  kode: aktivitetStatus.FRILANSER,
},
];

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatus.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === aktivitetStatus.FRILANSER) {
    return 'Frilanser';
  }

  return '';
};

describe('<SkjeringspunktOgStatusPanel>', () => {
  it('Skal teste at komponenten renderer riktig skjeringstidspunkt', () => {
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      getKodeverknavn={getKodeverknavn}
    />);

    const messages = wrapper.find('FormattedMessage');
    expect(messages).to.be.lengthOf(1);
    expect(messages.first().props().id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning');
    const dato = wrapper.find('DateLabel');
    expect(dato.first().props().dateString).to.equal(skjeringstidspunktDato);
  });

  it('Skal teste buildInitialValues når ingen aksjonspunkt', () => {
    const dekningsgradFraSoknad = 100;
    const gjeldendeAksjonspunkter = [];
    const initialValues = SkjeringspunktOgStatusPanel.buildInitialValues(dekningsgradFraSoknad, gjeldendeAksjonspunkter);
    expect(initialValues[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN]).to.equal(undefined);
  });
});

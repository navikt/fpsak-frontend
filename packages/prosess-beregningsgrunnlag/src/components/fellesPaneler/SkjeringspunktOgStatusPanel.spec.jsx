import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import SkjeringspunktOgStatusPanel, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN, SkjeringspunktOgStatusPanelImpl } from './SkjeringspunktOgStatusPanel';

const apentVurderDekningsgradAP = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
  },
  status: {
    kode: 'OPPR',
  },
  kanLoses: true,
  erAktivt: true,
};
const lukketVurderDekningsgradAP = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
  },
  status: {
    kode: 'UTFO',
  },
  kanLoses: false,
  erAktivt: true,
};
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
  it('Skal se at korrekte verdier settes i undertittlene', () => {
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      readOnly
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      gjeldendeAksjonspunkter={[]}
      gjeldendeDekningsgrad={100}
      getKodeverknavn={getKodeverknavn}
    />);
    expect(wrapper.find('Normaltekst').children().at(1).text()).to.equal('Arbeidstaker og frilanser');
    expect(wrapper.find('Normaltekst').children().at(0).text()).is.eql('<DateLabel />');
  });
  it('Skal teste at komponenten renderer riktig uten dekningsgrad', () => {
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      readOnly
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      gjeldendeAksjonspunkter={[]}
      gjeldendeDekningsgrad={undefined}
      getKodeverknavn={getKodeverknavn}
    />);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.be.lengthOf(0);
    const messages = wrapper.find('FormattedMessage');
    expect(messages).to.be.lengthOf(3);
    expect(messages.get(0).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.ApplicationInformationUtenDekningsgrad');
    expect(messages.get(1).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning');
    expect(messages.get(2).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.Status');
  });
  it('Skal teste at radioknapper for vurder dekningsgrad blir vist når aksjonspunktet er åpent', () => {
    const ap = [apentVurderDekningsgradAP];
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      readOnly={false}
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      gjeldendeAksjonspunkter={ap}
      gjeldendeDekningsgrad={100}
      getKodeverknavn={getKodeverknavn}
    />);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup.props().name).to.equal('dekningsgrad');
    expect(radioGroup.props().readOnly).to.equal(false);
    expect(radioGroup.props().isEdited).to.equal(false);
    expect(radioGroup.props().children).to.lengthOf(2);
    expect(radioGroup.props().children[0].key).to.equal('vurder_dekningsgrad_80');
    expect(radioGroup.props().children[1].key).to.equal('vurder_dekningsgrad_100');
  });
  it('Skal teste at radioknapper for vurder dekningsgrad blir vist når aksjonspunktet er lukket ', () => {
    const ap = [lukketVurderDekningsgradAP];
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      readOnly
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      gjeldendeAksjonspunkter={ap}
      gjeldendeDekningsgrad={100}
      getKodeverknavn={getKodeverknavn}
    />);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup.props().name).to.equal('dekningsgrad');
    expect(radioGroup.props().readOnly).to.equal(true);
    expect(radioGroup.props().isEdited).to.equal(true);
    expect(radioGroup.props().children).to.lengthOf(2);
    expect(radioGroup.props().children[0].key).to.equal('vurder_dekningsgrad_80');
    expect(radioGroup.props().children[1].key).to.equal('vurder_dekningsgrad_100');
  });
  it('Skal teste at radioknapper for vurder dekningsgrad ikke blir vist når aksjonspunktet ikke er tilstedet', () => {
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      readOnly
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
      gjeldendeAksjonspunkter={[]}
      gjeldendeDekningsgrad={100}
      getKodeverknavn={getKodeverknavn}
    />);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.lengthOf(0);
    const messages = wrapper.find('FormattedMessage');
    expect(messages).to.be.lengthOf(4);
    expect(messages.get(0).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.ApplicationInformation');
    expect(messages.get(1).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning');
    expect(messages.get(2).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.Status');
    expect(messages.get(3).props.id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.Dekningsgrad');
  });
  it('Skal teste buildInitialValues når vurder dekningsgrad aksjonspunkt er åpent', () => {
    const dekningsgradFraSoknad = 100;
    const gjeldendeAksjonspunkter = [apentVurderDekningsgradAP];
    const initialValues = SkjeringspunktOgStatusPanel.buildInitialValues(dekningsgradFraSoknad, gjeldendeAksjonspunkter);
    expect(initialValues[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN]).to.equal(100);
  });
  it('Skal teste buildInitialValues når vurder dekningsgrad aksjonspunkt er lukket', () => {
    const dekningsgradFraSoknad = 100;
    const gjeldendeAksjonspunkter = [lukketVurderDekningsgradAP];
    const initialValues = SkjeringspunktOgStatusPanel.buildInitialValues(dekningsgradFraSoknad, gjeldendeAksjonspunkter);
    expect(initialValues[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN]).to.equal(100);
  });
  it('Skal teste buildInitialValues når ingen aksjonspunkt', () => {
    const dekningsgradFraSoknad = 100;
    const gjeldendeAksjonspunkter = [];
    const initialValues = SkjeringspunktOgStatusPanel.buildInitialValues(dekningsgradFraSoknad, gjeldendeAksjonspunkter);
    expect(initialValues[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN]).to.equal(undefined);
  });
});

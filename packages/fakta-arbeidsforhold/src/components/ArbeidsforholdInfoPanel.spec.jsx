import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/src/AksjonspunktHelpText';

import { ArbeidsforholdInfoPanelImpl, fjernIdFraArbeidsforholdLagtTilAvSaksbehandler } from './ArbeidsforholdInfoPanel';
import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';
import BekreftOgForsettKnapp from './BekreftOgForsettKnapp';

const ap5080 = {
  id: 0,
  definisjon: {
    navn: 'avklar arbeidsforhold',
    kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
  },
  status: {
    navn: 'Opprettet',
    kode: '',
  },
  kanLoses: true,
  erAktivt: true,
};

describe('<ArbeidsforholdInfoPanel>', () => {
  it('Skal vise komponenten korrekt med aksjonspunkt hvor man ikke kan legge til nye arbeidsforhold', () => {
    const wrapper = shallow(
      <ArbeidsforholdInfoPanelImpl
        aksjonspunkter={[ap5080]}
        readOnly={false}
        hasOpenAksjonspunkter
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
    );
    const apMsg = wrapper.find('FormattedMessage');
    expect(apMsg).has.length(1);
    expect(apMsg.props().id).has.eql('ArbeidsforholdInfoPanel.AvklarArbeidsforhold');
    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
    expect(wrapper.find(BekreftOgForsettKnapp)).has.length(1);
  });
  it('Skal vise komponenten korrekt med aksjonspunkt hvor man kan legge til nye arbeidsforhold', () => {
    const wrapper = shallow(
      <ArbeidsforholdInfoPanelImpl
        aksjonspunkter={[ap5080]}
        readOnly={false}
        hasOpenAksjonspunkter
        skalKunneLeggeTilNyeArbeidsforhold
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
    );
    const apMsg = wrapper.find('FormattedMessage');
    expect(apMsg).has.length(1);
    expect(apMsg.props().id).has.eql('ArbeidsforholdInfoPanel.IngenArbeidsforholdRegistrert');
    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
    expect(wrapper.find(BekreftOgForsettKnapp)).has.length(1);
  });
  it('Skal vise komponenten korrekt uten aksjonspunkt hvor man kan legge til nye arbeidsforhold', () => {
    const wrapper = shallow(
      <ArbeidsforholdInfoPanelImpl
        aksjonspunkter={[]}
        readOnly={false}
        hasOpenAksjonspunkter={false}
        skalKunneLeggeTilNyeArbeidsforhold
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
    expect(wrapper.find(BekreftOgForsettKnapp)).has.length(0);
    expect(wrapper.find(AksjonspunktHelpText)).has.length(0);
  });
  it('skal fjerne ID fra arbeidsforhold som er lagt til av saksbehandler, men ikke fra andre', () => {
    const arbeidsforhold = [
      {
        id: 1,
        lagtTilAvSaksbehandler: true,
      },
      {
        id: 2,
        lagtTilAvSaksbehandler: false,
      },
    ];
    const result = fjernIdFraArbeidsforholdLagtTilAvSaksbehandler(arbeidsforhold);
    expect(result[0].id).to.eql(null);
    expect(result[0].lagtTilAvSaksbehandler).to.eql(true);
    expect(result[1].id).to.eql(2);
    expect(result[1].lagtTilAvSaksbehandler).to.eql(false);
  });
});

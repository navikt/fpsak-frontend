import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { AnnenForelderHarRettForm } from './AnnenForelderHarRettForm';


const avklarAnnenforelderHarRettAp = [{
  aksjonspunktType: {
    kode: 'MANU',
    navn: 'Manuell',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  kode: 'MANU',
  kodeverk: 'AKSJONSPUNKT_TYPE',
  navn: 'Manuell',
  begrunnelse: 'test2',
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5086',
    navn: 'Avklar annen forelder har ikke rett',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'UTFO',
    navn: 'Utført',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
}];

describe('<AnnenForelderHarRettForm>', () => {
  it('skal vise AnnenForelderHarRettForm', () => {
    const wrapper = shallow(<AnnenForelderHarRettForm
      hasOpenAksjonspunkter
      hasOpenUttakAksjonspunkter
      aksjonspunkter={avklarAnnenforelderHarRettAp}
      readOnly={false}
    />);

    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(1);
    expect(helpText.childAt(0).prop('id')).is.eql('UttakInfoPanel.Aksjonspunkt.5086');

    const panel = wrapper.find('div').first();
    expect(panel.find(FaktaSubmitButton)).has.length(1);
  });
});

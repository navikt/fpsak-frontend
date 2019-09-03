import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { FaktaEkspandertpanel } from '@fpsak-frontend/fp-behandling-felles';
import { UttakInfoPanelImpl } from './UttakInfoPanel';
import UttakFaktaForm from './UttakFaktaForm';
import AnnenForelderHarRettForm from './AnnenForelderHarRettForm';

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

describe('<UttakInfoPanel>', () => {
  it('skal vise UttakInfoPanel', () => {
    const toggleInfoPanelCallback = sinon.spy();

    const wrapper = shallowWithIntl(<UttakInfoPanelImpl
      intl={intlMock}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      readOnly
      hasOpenAksjonspunkter
      isRevurdering={false}
      hasStatusUtredes={false}
      behandlingPaaVent={false}
      aksjonspunkter={[]}
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    const uttakFaktaForm = faktaEkspandertpanel.find(UttakFaktaForm);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(uttakFaktaForm).to.have.length(1);
  });

  it('skal vise Avklar annen forelder har rett ', () => {
    const toggleInfoPanelCallback = sinon.spy();

    const wrapper = shallowWithIntl(<UttakInfoPanelImpl
      intl={intlMock}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      readOnly
      hasOpenAksjonspunkter
      isRevurdering={false}
      hasStatusUtredes={false}
      behandlingPaaVent={false}
      aksjonspunkter={avklarAnnenforelderHarRettAp}
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    const annenForelderHarRettForm = faktaEkspandertpanel.find(AnnenForelderHarRettForm);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(annenForelderHarRettForm).to.have.length(1);
  });
});

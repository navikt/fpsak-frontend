import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import FodselSammenligningPanel from 'behandling/components/fodselSammenligning/FodselSammenligningPanel';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import { FodselInfoPanelImpl } from './FodselInfoPanel';
import SjekkFodselDokForm from './SjekkFodselDokForm';
import TermindatoFaktaForm from './TermindatoFaktaForm';

describe('<FodselInfoPanel>', () => {
  it('skal vise sjekkFodselDok-form når en har dette aksjonspunktet', () => {
    const antallBarnAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[antallBarnAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
    />);

    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel.prop('title')).to.eql('Fakta om fødsel');

    expect(wrapper.find(SjekkFodselDokForm)).has.length(1);
  });

  it('skal vise termindato-form når en har dette aksjonspunktet', () => {
    const terminbekreftelseAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.TERMINBEKREFTELSE,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[terminbekreftelseAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
    />);

    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel.prop('title')).to.eql('Fakta om fødsel');

    expect(wrapper.find(TermindatoFaktaForm)).has.length(1);
  });

  it('skal vise infoview når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
    />);

    expect(wrapper.find(FodselSammenligningPanel)).has.length(1);
    expect(wrapper.find(SjekkFodselDokForm)).has.length(0);
    expect(wrapper.find(TermindatoFaktaForm)).has.length(0);
  });
});

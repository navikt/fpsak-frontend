import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import faktaPanelCodes from 'behandlingFpsak/fakta/faktaPanelCodes';
import FaktaEkspandertpanel from 'behandlingFelles/fakta/components/FaktaEkspandertpanel';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { MedlemskapInfoPanelImpl } from './MedlemskapInfoPanel';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<MedlemskapInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
    />);

    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel).has.length(1);
    expect(panel.prop('title')).to.eql('Fakta om medlemskap');
    expect(panel.prop('hasOpenAksjonspunkter')).is.false;
    expect(panel.prop('isInfoPanelOpen')).is.false;
    expect(panel.prop('faktaId')).to.eql(faktaPanelCodes.MEDLEMSKAPSVILKARET);
    expect(panel.prop('readOnly')).is.true;
  });

  it('skal kun vise form for startdato for foreldrepengerperioden når en har aksjonspunktet for dette', () => {
    const avklarStartdatoAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<MedlemskapInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[avklarStartdatoAksjonspunkt]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(0);
  });

  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    const avklarStartdatoAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: false,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<MedlemskapInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[avklarStartdatoAksjonspunkt]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });

  it('skal ikke vise panel for avklaring av startdato for foreldrepengerperioden når aksjonspunktet ikke finnes', () => {
    const wrapper = shallowWithIntl(<MedlemskapInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(0);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });
});
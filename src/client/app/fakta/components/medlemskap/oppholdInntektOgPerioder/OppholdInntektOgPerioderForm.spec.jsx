import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import { OppholdInntektOgPerioderForm } from './OppholdInntektOgPerioderForm';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import InntektOgYtelserFaktaPanel from './InntektOgYtelserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import FortsattMedlemskapFaktaPanel from './FortsattMedlemskapFaktaPanel';

describe('<OppholdInntektOgPerioderForm>', () => {
  it('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{}}
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
    />);

    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).has.length(1);

    expect(wrapper.find(OppholdINorgeOgAdresserFaktaPanel)).has.length(1);
    expect(wrapper.find(InntektOgYtelserFaktaPanel)).has.length(1);
    expect(wrapper.find(PerioderMedMedlemskapFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(0);
    expect(wrapper.find(FaktaSubmitButton)).has.length(0);
  });

  it('skal avklare bosatt data når en har dette aksjonspunktet', () => {
    const bosattAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
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

    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[bosattAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);


    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(1);
    expect(helpText.childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.ErSokerBosattINorge');

    expect(wrapper.find('Connect(InjectIntl(OppholdINorgeOgAdresserFaktaPanelImpl))')).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
  });

  it('skal avklare perioder når en har dette aksjonspunktet', () => {
    const periodeAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
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

    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[periodeAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    expect(wrapper.find(AksjonspunktHelpText).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.GyldigMedlemFolketrygden');

    expect(wrapper.find(PerioderMedMedlemskapFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
  });

  it('skal avklare oppholdsrett når en har dette aksjonspunktet', () => {
    const oppholdsrettAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
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

    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[oppholdsrettAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    expect(wrapper.find(AksjonspunktHelpText).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.EOSBorgerMedOppholdsrett');

    expect(wrapper.find(StatusForBorgerFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
  });

  it('skal avklare lovlig opphold når en har dette aksjonspunktet', () => {
    const lovligOppholdAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
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

    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[lovligOppholdAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    expect(wrapper.find(AksjonspunktHelpText).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold');

    expect(wrapper.find(StatusForBorgerFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
  });


  it('skal avklare fortsatt medlemskap når en har dette aksjonspunktet', () => {
    const fortsattMedlemskapAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
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

    const wrapper = shallowWithIntl(<OppholdInntektOgPerioderForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[fortsattMedlemskapAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    expect(wrapper.find(AksjonspunktHelpText).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.HarFortsattMedlemskap');

    expect(wrapper.find(FortsattMedlemskapFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
  });
});

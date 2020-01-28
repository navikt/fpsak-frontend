import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { OppholdInntektOgPerioderForm, transformValues } from './OppholdInntektOgPerioderForm';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-medlemskap';

const perioder = [];

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
      isRevurdering={false}
      perioder={perioder}
      readOnly
      alleMerknaderFraBeslutter={{}}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).has.length(1);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.true;
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
      isRevurdering={false}
      alleMerknaderFraBeslutter={{}}
    />);


    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(1);
    expect(helpText.childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.ErSokerBosattINorge');

    expect(wrapper.find(Hovedknapp)).has.length(1);
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
      isRevurdering={false}
      alleMerknaderFraBeslutter={{}}
    />);

    expect(wrapper.find(AksjonspunktHelpTextTemp).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.GyldigMedlemFolketrygden');

    expect(wrapper.find(Hovedknapp)).has.length(1);
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
      isRevurdering={false}
      alleMerknaderFraBeslutter={{}}
    />);

    expect(wrapper.find(AksjonspunktHelpTextTemp).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.EOSBorgerMedOppholdsrett');

    expect(wrapper.find(Hovedknapp)).has.length(1);
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
      isRevurdering={false}
      alleMerknaderFraBeslutter={{}}
    />);

    expect(wrapper.find(AksjonspunktHelpTextTemp).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold');

    expect(wrapper.find(Hovedknapp)).has.length(1);
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
      isRevurdering={false}
      alleMerknaderFraBeslutter={{}}
    />);

    expect(wrapper.find(AksjonspunktHelpTextTemp).childAt(0).prop('id')).is.eql('MedlemskapInfoPanel.HarFortsattMedlemskap');

    expect(wrapper.find(Hovedknapp)).has.length(1);
  });


  it('skal kun avklare aksjonspunkt som er aktive', () => {
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
      kanLoses: false,
      erAktivt: false,
    };

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

    const values = {
      perioder: [
        {
          aksjonspunkter: [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD],
          begrunnelse: 'dawdawdawdawdawda',
          bosattVurdering: null,
          erEosBorger: false,
          lovligOppholdVurdering: true,
          medlemskapManuellVurderingType: null,
          oppholdsrettVurdering: null,
          vurderingsdato: '2019-10-06',
          årsaker: ['STATSBORGERSKAP'],
        },
      ],
    };

    const transformed = transformValues(values, [lovligOppholdAksjonspunkt, fortsattMedlemskapAksjonspunkt]);

    expect(transformed).has.length(1);
    expect(transformed[0].kode).is.eql(aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP);
  });
});

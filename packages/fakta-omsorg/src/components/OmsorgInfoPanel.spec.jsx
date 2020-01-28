import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';

import OmsorgFaktaForm from './OmsorgFaktaForm';
import { OmsorgInfoPanel } from './OmsorgInfoPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-omsorg';

describe('<OmsorgInfoPanel>', () => {
  const personopplysning = {
    navn: 'Espen Utvikler',
    aktoerId: '1',
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
    },
    navBrukerKjonn: {
      kode: '',
      navn: '',
    },
    statsborgerskap: {
      kode: '',
      navn: '',
    },
    diskresjonskode: {
      kode: '',
      navn: '',
    },
    sivilstand: {
      kode: 'UGIF',
      navn: 'Ugift',
    },
    region: {
      kode: '',
      navn: '',
    },
    adresser: [],
  };
  const aleneomsorgAp = {
    id: 1,
    definisjon: {
      kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
      navn: 'ap1',
    },
    status: {
      kode: 's1',
      navn: 's1',
    },
    kanLoses: true,
    erAktivt: false,
  };

  const omsorgAp = {
    id: 1,
    definisjon: {
      kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
      navn: 'ap1',
    },
    status: {
      kode: 's1',
      navn: 's1',
    },
    kanLoses: true,
    erAktivt: false,
  };
  it('skal vise omsorginfopanel når en har aleneomsorgaksjonspunkt', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanel
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[aleneomsorgAp]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      alleKodeverk={{}}
      behandlingId={1}
      behandlingVersjon={1}
      ytelsefordeling={{}}
      soknad={{}}
      alleMerknaderFraBeslutter={{}}
      personopplysninger={personopplysning}
    />);
    const panel = wrapper.find(OmsorgFaktaForm);
    expect(panel).to.have.length(1);
  });

  it('skal vise helptext for omsorg og aleneomsorg aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanel
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[aleneomsorgAp, omsorgAp]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysninger={personopplysning}
      alleKodeverk={{}}
      behandlingId={1}
      behandlingVersjon={1}
      ytelsefordeling={{}}
      soknad={{}}
      alleMerknaderFraBeslutter={{}}
    />);
    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).has.length(1);
    const helpTextMessage = wrapper.find(FormattedMessage);
    expect(helpTextMessage).has.length(2);
    expect(helpTextMessage.at(0).prop('id')).is.eql('OmsorgInfoPanel.VurderAleneomsorg');
    expect(helpTextMessage.at(1).prop('id')).is.eql('OmsorgInfoPanel.VurderOmsorg');
  });

  it('skal vise helptext for omsorg aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanel
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysninger={personopplysning}
      alleKodeverk={{}}
      behandlingId={1}
      behandlingVersjon={1}
      ytelsefordeling={{}}
      soknad={{}}
      alleMerknaderFraBeslutter={{}}
    />);
    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).has.length(1);
    const helpTextMessage = wrapper.find(FormattedMessage);
    expect(helpTextMessage).has.length(1);
    expect(helpTextMessage.at(0).prop('id')).is.eql('OmsorgInfoPanel.VurderOmsorg');
  });

  it('skal vise BostedFakta', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanel
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysninger={personopplysning}
      alleKodeverk={{}}
      behandlingId={1}
      behandlingVersjon={1}
      ytelsefordeling={{}}
      soknad={{}}
      alleMerknaderFraBeslutter={{}}
    />);
    const bostedFaktaView = wrapper.find('BostedFaktaView');
    expect(bostedFaktaView).has.length(1);
    expect(bostedFaktaView.at(0).prop('personopplysning')).is.eql(personopplysning);
  });

  it('skal vise OmsorgFaktaForm', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanel
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysninger={personopplysning}
      alleKodeverk={{}}
      behandlingId={1}
      behandlingVersjon={1}
      ytelsefordeling={{}}
      soknad={{}}
      alleMerknaderFraBeslutter={{}}
    />);
    const omsorgFaktaForm = wrapper.find(OmsorgFaktaForm);
    expect(omsorgFaktaForm).has.length(1);
    expect(omsorgFaktaForm.at(0).prop('omsorg')).is.eql(false);
    expect(omsorgFaktaForm.at(0).prop('aksjonspunkter')).is.eql([omsorgAp]);
    expect(omsorgFaktaForm.at(0).prop('readOnly')).is.eql(false);
  });
});

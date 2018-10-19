import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { OmsorgInfoPanelImpl } from './OmsorgInfoPanel';
import OmsorgFaktaForm from './OmsorgFaktaForm';

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
    opplysningsKilde: {
      kode: '',
      navn: '',
    },
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
    const wrapper = shallowWithIntl(<OmsorgInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[aleneomsorgAp]}
      openInfoPanels={['omsorg']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysning={personopplysning}
    />);
    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel).to.have.length(1);
    expect(panel.prop('title')).to.eql('Fakta om omsorg');
    expect(panel.prop('hasOpenAksjonspunkter')).is.true;
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql('omsorg');
  });

  it('skal vise helptext for omsorg og aleneomsorg aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[aleneomsorgAp, omsorgAp]}
      openInfoPanels={['omsorg']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysning={personopplysning}
    />);
    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).has.length(1);
    const helpTextMessage = wrapper.find('FormattedMessage');
    expect(helpTextMessage).has.length(2);
    expect(helpTextMessage.at(0).prop('id')).is.eql('OmsorgInfoPanel.VurderAleneomsorg');
    expect(helpTextMessage.at(1).prop('id')).is.eql('OmsorgInfoPanel.VurderOmsorg');
  });

  it('skal vise helptext for omsorg aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      openInfoPanels={['omsorg']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysning={personopplysning}
    />);
    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).has.length(1);
    const helpTextMessage = wrapper.find('FormattedMessage');
    expect(helpTextMessage).has.length(1);
    expect(helpTextMessage.at(0).prop('id')).is.eql('OmsorgInfoPanel.VurderOmsorg');
  });

  it('skal vise BostedFakta', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      openInfoPanels={['omsorg']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysning={personopplysning}
    />);
    const bostedFaktaView = wrapper.find('BostedFaktaView');
    expect(bostedFaktaView).has.length(1);
    expect(bostedFaktaView.at(0).prop('personopplysning')).is.eql(personopplysning);
  });

  it('skal vise OmsorgFaktaForm', () => {
    const wrapper = shallowWithIntl(<OmsorgInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      omsorg={false}
      intl={intlMock}
      aksjonspunkter={[omsorgAp]}
      openInfoPanels={['omsorg']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      personopplysning={personopplysning}
    />);
    const omsorgFaktaForm = wrapper.find(OmsorgFaktaForm);
    expect(omsorgFaktaForm).has.length(1);
    expect(omsorgFaktaForm.at(0).prop('omsorg')).is.eql(false);
    expect(omsorgFaktaForm.at(0).prop('aksjonspunkter')).is.eql([omsorgAp]);
    expect(omsorgFaktaForm.at(0).prop('readOnly')).is.eql(false);
  });
});

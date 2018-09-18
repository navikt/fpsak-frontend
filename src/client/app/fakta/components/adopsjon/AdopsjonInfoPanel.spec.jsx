import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import { AdopsjonInfoPanelImpl } from './AdopsjonInfoPanel';
import DokumentasjonFaktaForm from './DokumentasjonFaktaForm';
import EktefelleFaktaForm from './EktefelleFaktaForm';
import MannAdoptererFaktaForm from './MannAdoptererFaktaForm';

describe('<AdopsjonInfoPanel>', () => {
  const adopsjonAksjonspunkt = {
    id: 1,
    definisjon: {
      kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
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
  const ektefellesBarnAksjonspunkt = {
    id: 2,
    definisjon: {
      kode: aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
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


  it('skal vise de to aksjonspunktene som alltid skal vises', () => {
    const wrapper = shallowWithIntl(<AdopsjonInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[adopsjonAksjonspunkt, ektefellesBarnAksjonspunkt]}
      openInfoPanels={['adsopsjonsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('title')).to.eql('Fakta om adopsjon');

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(2);
    expect(helpText.childAt(0).prop('id')).is.eql('AdopsjonInfoPanel.KontrollerMotDok');
    expect(helpText.childAt(1).prop('id')).is.eql('AdopsjonInfoPanel.VurderOmEktefellesBarn');

    expect(panel.find(DokumentasjonFaktaForm)).has.length(1);
    expect(panel.find(EktefelleFaktaForm)).has.length(1);
    expect(panel.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(panel.find(FaktaSubmitButton)).has.length(1);
  });

  it('skal vise alle tre adopsjonsaksjonspunktene', () => {
    const mannSokerAleneAksjonspunkt = {
      id: 3,
      definisjon: {
        kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
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

    const wrapper = shallowWithIntl(<AdopsjonInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE}`]: 'test' }}
      intl={intlMock}
      aksjonspunkter={[adopsjonAksjonspunkt, ektefellesBarnAksjonspunkt, mannSokerAleneAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('title')).to.eql('Fakta om adopsjon');

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(3);
    expect(helpText.childAt(0).prop('id')).is.eql('AdopsjonInfoPanel.KontrollerMotDok');
    expect(helpText.childAt(1).prop('id')).is.eql('AdopsjonInfoPanel.VurderOmEktefellesBarn');
    expect(helpText.childAt(2).prop('id')).is.eql('AdopsjonInfoPanel.VurderOmMannAdoptererAlene');

    expect(panel.find(DokumentasjonFaktaForm)).has.length(1);
    expect(panel.find(EktefelleFaktaForm)).has.length(1);
    expect(panel.find(MannAdoptererFaktaForm)).has.length(1);
    expect(panel.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(panel.find(FaktaSubmitButton)).has.length(1);
  });

  it('skal ikke vise hjelpetekster når saken er lukket', () => {
    const wrapper = shallowWithIntl(<AdopsjonInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[adopsjonAksjonspunkt, ektefellesBarnAksjonspunkt]}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
    />);

    expect(wrapper.find('HelpText')).has.length(0);
  });
});

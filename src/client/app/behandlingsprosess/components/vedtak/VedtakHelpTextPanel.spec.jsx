import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingResultatType from 'kodeverk/behandlingResultatType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import vilkarType from 'kodeverk/vilkarType';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import { VedtakHelpTextPanelImpl } from './VedtakHelpTextPanel';


const createBehandling = (behandlingResultatType, behandlingHenlagt) => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  aksjonspunkter: [],
  behandlingPaaVent: false,
  behandlingHenlagt,
  sprakkode: {
    kode: 'NO',
    navn: 'norsk',
  },
  behandlingsresultat: {
    id: 1,
    type: {
      kode: behandlingResultatType,
      navn: 'test',
    },
    avslagsarsak: behandlingResultatType === BehandlingResultatType.AVSLATT ? {
      kode: '1019',
      navn: 'Manglende dokumentasjon',
    } : null,
    avslagsarsakFritekst: null,
  },
  vilkar: [{
    vilkarType: {
      kode: vilkarType.FODSELSVILKARET,
      navn: 'Fødselsvilkåret',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
      navn: 'test',
    },
    lovReferanse: '§ 22-13, 2. ledd',
  }, {
    vilkarType: {
      kode: vilkarType.SOKNADFRISTVILKARET,
      navn: 'Søknadsfristvilkåret',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
      navn: 'test',
    },
    lovReferanse: '§ 22-13, 2. ledd',
  }, {
    vilkarType: {
      kode: vilkarType.MEDLEMSKAPSVILKARET,
      navn: 'Medlemskapsvilkåret',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
      navn: 'test',
    },
    lovReferanse: '§ 22-13, 2. ledd',
  }],
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    navn: 'test',
  },
  type: {
    kode: 'test',
    navn: 'test',
  },
  opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
});

const createBehandlingInnvilget = behandlingHenlagt => createBehandling(BehandlingResultatType.INNVILGET, behandlingHenlagt || false);

describe('<VedtakHelpTextPanel>', () => {
  it('skal vise hjelpetekst for vurdering av dokument når en har dette aksjonspunktet', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      behandling={createBehandlingInnvilget()}
      aksjonspunktKoder={[aksjonspunktCodes.VURDERE_DOKUMENT]}
      readOnly={false}
      isBehandlingReadOnly={false}
    />);

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText.prop('isAksjonspunktOpen')).is.true;
    expect(helpText.children()).to.have.length(1);
    expect(helpText.childAt(0).text()).is.eql('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen');
  });


  it('skal vise hjelpetekst for vurdering av dokument og vurdering av annen ytelse når en har disse aksjonspunktetene', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      behandling={createBehandlingInnvilget()}
      aksjonspunktKoder={[aksjonspunktCodes.VURDERE_ANNEN_YTELSE, aksjonspunktCodes.VURDERE_DOKUMENT]}
      readOnly={false}
      isBehandlingReadOnly={false}
    />);

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText.prop('isAksjonspunktOpen')).is.true;
    expect(helpText.children()).to.have.length(2);
    expect(helpText.childAt(0).text()).is.eql('Vurder om den åpne oppgaven «Vurder konsekvens for ytelse» påvirker behandlingen');
    expect(helpText.childAt(1).text()).is.eql('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen');
  });


  it('skal ikke vise hjelpetekst når en ikke har gitte aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      behandling={createBehandlingInnvilget()}
      aksjonspunktKoder={[aksjonspunktCodes.FORESLA_VEDTAK]}
      readOnly={false}
      isBehandlingReadOnly={false}
    />);

    expect(wrapper.find('HelpText')).to.have.length(0);
  });
});

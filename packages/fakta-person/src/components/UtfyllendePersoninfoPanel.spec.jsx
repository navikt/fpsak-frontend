import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './FullPersonInfo';
import { UtfyllendePersoninfoPanel } from './UtfyllendePersoninfoPanel';

describe('<UtfyllendePersoninfoPanel>', () => {
  const personopplysninger = {
    navn: 'Parent 1',
    fnr: '26041150695',
    fodselsdato: '2011-04-15',
    navBrukerKjonn: {
      kode: navBrukerKjonn.KVINNE,
      navn: 'kvinne',
    },
    barn: [
      { fodselsdato: '2019-05-01' },
    ],
    diskresjonskode: {
      kode: 'TEST',
      navn: 'test',
    },
    personstatus: {
      kode: 'Ukjent',
      navn: 'ukjent',
    },
    annenPart: {
      navn: 'Parent 2',
      fnr: '26041250525',
      erKvinne: false,
      fodselsdato: '2012-04-26',
      navBrukerKjonn: {
        kode: navBrukerKjonn.MANN,
        navn: 'kvinne',
      },
      diskresjonskode: {
        kode: 'TEST',
        navn: 'test',
      },
      personstatus: {
        kode: 'Ukjent',
        navn: 'ukjent',
      },
    },
  };

  const personstatusTypes = [{
    kode: personstatusType.UFULLSTENDIGFNR,
    navn: 'Ufullstendig fnr',
  }, {
    kode: personstatusType.UTVANDRET,
    navn: 'Utvandret',
  }, {
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  }];

  const sivilstandTypes = [{
    kode: sivilstandType.GIFTLEVERADSKILT,
    navn: 'Gift, lever adskilt',
  }, {
    kode: sivilstandType.SKILT,
    navn: 'Skilt',
  }];

  const alleKodeverk = {
    [kodeverkTyper.SIVILSTAND_TYPE]: sivilstandTypes,
    [kodeverkTyper.PERSONSTATUS_TYPE]: personstatusTypes,
    [kodeverkTyper.RELATERT_YTELSE_TYPE]: [{
      kode: relatertYtelseType.FORELDREPENGER,
      navn: 'Foreldrepenger',
    }],
    [kodeverkTyper.FAGSAK_STATUS]: [{
      kode: fagsakStatus.OPPRETTET,
      navn: 'Opprettet',
    }],
    [kodeverkTyper.RELATERT_YTELSE_TILSTAND]: [{
      kode: relatertYtelseTilstand.LOPENDE,
      navn: 'Løpende',
    }],
  };

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal ikke vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt som ikke er AVKLAR_ARBEIDSFORHOLD', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'Søknadsfrist',
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      aksjonspunktType: {
        navn: 'AUTOPUNKT',
        kode: aksjonspunktType.AUTOPUNKT,
      },
      erAktivt: true,
    },
    ];
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal ikke vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt men annen part er valgt', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'Søknadsfrist',
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      aksjonspunktType: {
        navn: 'AUTOPUNKT',
        kode: aksjonspunktType.AUTOPUNKT,
      },
      erAktivt: true,
    },
    ];
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger.annenPart });

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal velge hovedsøker og legge denne i url ved klikk på hovedsøker i panel-header ', () => {
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.null;
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
  });

  it('skal ikke fjerna personmarkering i url ved bytte fra hovedsøker til annen part', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger.annenPart);

    expect(wrapper.state('selected')).is.eql(personopplysninger.annenPart);

    expect(toggleInfoPanelCallback.calledOnce).to.be.false;
  });

  it('skal fjerne valgt hovedsøker ved nytt klikk på denne i panel-header ', () => {
    const wrapper = shallow(
      <UtfyllendePersoninfoPanel
        behandlingId={1}
        behandlingVersjon={1}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        hasOpenAksjonspunkter
        sprakkode={{}}
        barnFraTps={[]}
        readOnly={false}
        readOnlyOriginal={false}
        isBekreftButtonReadOnly
        alleKodeverk={alleKodeverk}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.null;
  });
});

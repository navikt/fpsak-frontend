import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import aksjonspunktType from 'kodeverk/aksjonspunktType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './panelBody/FullPersonInfo';
import { PersonInfoPanelImpl as PersonInfoPanel } from './PersonInfoPanel';

describe('<PersonInfoPanel>', () => {
  const personopplysninger = {
    navn: 'Parent 1',
    fnr: '26041150695',
    fodselsdato: '2011-04-15',
    navBrukerKjonn: {
      kode: navBrukerKjonn.KVINNE,
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

  const relatertYtelseTypes = [];
  const relatertYtelseStatus = [];

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal vise søkerpanel automatisk når dette er markert i URL (openInfoPanels)', () => {
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    expect(wrapper.state('selected')).is.null;
    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });
    expect(wrapper.state('selected')).is.eql(personopplysninger);

    expect(wrapper.find(EkspanderbartPersonPanel)).to.have.length(1);
    const infoPanel = wrapper.find(FullPersonInfo);
    expect(infoPanel).to.have.length(1);
    expect(infoPanel.prop('personopplysning')).to.eql(personopplysninger);
    expect(infoPanel.prop('isPrimaryParent')).is.true;

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt og har valgt hovedsøker', () => {
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
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={aksjonspunkter}
      {...reduxFormPropsMock}
    />);

    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });

    expect(wrapper.find(Hovedknapp)).to.have.length(1);
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
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={aksjonspunkter}
      {...reduxFormPropsMock}
    />);

    wrapper.setState({ selected: personopplysninger.annenPart });

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal velge hovedsøker og legge denne i url ved klikk på hovedsøker i panel-header ', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.null;
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.eql(personopplysninger);

    expect(toggleInfoPanelCallback.calledOnce).to.be.true;
    const { args } = toggleInfoPanelCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(faktaPanelCodes.PERSON);
  });

  it('skal ikke fjerna personmarkering i url ved bytte fra hovedsøker til annen part', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger.annenPart);

    expect(wrapper.state('selected')).is.eql(personopplysninger.annenPart);

    expect(toggleInfoPanelCallback.calledOnce).to.be.false;
  });

  it('skal fjerne valgt hovedsøker ved nytt klikk på denne i panel-header ', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      aksjonspunkter={[]}
      {...reduxFormPropsMock}
    />);

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.null;

    expect(toggleInfoPanelCallback.calledOnce).to.be.true;
    const { args } = toggleInfoPanelCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(faktaPanelCodes.PERSON);
  });
});

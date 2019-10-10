import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import UttakInfoPanel from './uttak/UttakInfoPanel';
import BeregningInfoPanel from './beregning/BeregningInfoPanel';
import FodselOgTilretteleggingInfoPanel from './fodselOgTilrettelegging/FodselOgTilretteleggingInfoPanel';
import { FaktaPanel } from './FaktaPanel';

describe('<FaktaPanel>', () => {
  const ytelsefordeling = {
    aleneOmsorgPerioder: null,
    annenforelderHarRettDto: {},
    endringsdato: '2019-03-22',
    førsteUttaksdato: '2019-03-22',
    gjeldendeDekningsgrad: 100,
    ikkeOmsorgPerioder: null,
  };

  const soknad = {
    innhold: 'mat',
  };

  const personopplysninger = {
    navBrukerKjonn: {
      kode: '',
      navn: '',
    },
    statsborgerskap: {
      kode: '',
      navn: '',
    },
    personstatus: {
      personstatus: {
        kode: '',
        navn: '',
      },
    },
    diskresjonskode: {
      kode: '',
      navn: '',
    },
    sivilstand: {
      kode: '',
      navn: '',
    },
    aktoerId: '1',
    navn: 'espen',
    region: {
      kode: '',
      navn: '',
    },
    opplysningsKilde: {
      kode: '',
      navn: '',
    },
  };

  const medlemAksjonspunkt = {
    id: 1,
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
      navn: 'TEST',
    },
    definisjon: {
      kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      navn: 'test',
    },
    vilkarType: {
      kode: vilkarType.MEDLEMSKAPSVILKARET,
      navn: 'test',
    },
    kanLoses: true,
    erAktivt: true,
  };

  const ytelsestype = {
    kode: fagsakYtelseType.FORELDREPENGER,
  };

  const person = {
    navn: 'Espen Utvikler',
    alder: 40,
    personnummer: '1234546',
    erKvinne: false,
    personstatusType: {
      kode: 'test',
      navn: 'test',
    },
  };


  it('skal vise faktapanel for tilleggsopplysninger og medlemskap når en har aksjonspunkt for disse', () => {
    const tilleggsopplysningerAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, tilleggsopplysningerAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      readOnlyBehandling={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
    />);

    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for omsorg(aleneomsorg) og medlemskap når en har aksjonspunkt for medlemskap og aleneomsorg', () => {
    const aleneomsorgAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, aleneomsorgAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for omsorg(aleneomsorg) og medlemskap når aksjonspunkt for medlemskap og omsorg', () => {
    const omsorgAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, omsorgAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for omsorg og medlemskap når en har aksjonspunkt for disse', () => {
    const omsorgAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.OMSORGSOVERTAKELSE,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, omsorgAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for svangerskapspenger og medlemskap når en har aksjonspunkt for disse', () => {
    const omsorgAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[omsorgAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(FodselOgTilretteleggingInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for adopsjon og medlemskap når en har aksjonspunkt for disse', () => {
    const adopsjonAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
        navn: 'test',
      },
      vilkarType: {
        kode: vilkarType.ADOPSJONSVILKARET,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, adopsjonAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal IKKE vise faktapanel for uttak hvis endringsdato ikke er satt', () => {
    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={{ ...ytelsefordeling, endringsdato: null }}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);
    expect(wrapper.find(UttakInfoPanel)).has.length(0);
  });


  it('skal vise faktapanel for beregning når man er overstyrer', () => {
    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      soknad={soknad}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer
      ytelsefordeling={ytelsefordeling}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      readOnlyBehandling={false}
    />);
    expect(wrapper.find(BeregningInfoPanel)).has.length(1);
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedlemskapInfoPanel from './medlemskap/MedlemskapInfoPanel';
import TilleggsopplysningerInfoPanel from './tilleggsopplysninger/TilleggsopplysningerInfoPanel';
import OmsorgInfoPanel from './omsorg/OmsorgInfoPanel';
import OmsorgOgForeldreansvarInfoPanel from './omsorgOgForeldreansvar/OmsorgOgForeldreansvarInfoPanel';
import AdopsjonInfoPanel from './adopsjon/AdopsjonInfoPanel';
import UttakInfoPanel from './uttak/UttakInfoPanel';
import FodselInfoPanel from './fodsel/FodselInfoPanel';
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(1);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(1);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(FodselOgTilretteleggingInfoPanel)).has.length(1);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
  });


  it('skal vise faktapanel for foreldreansvar når en har aksjonspunkt for denne', () => {
    const omsorgAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, omsorgAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(1);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
    expect(wrapper.find(UttakInfoPanel)).has.length(1);
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
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(1);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal vise faktapanel for fødsel og medlemskap når en har aksjonspunkt for disse', () => {
    const fodselAksjonspunkt = {
      id: 1,
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'TEST',
      },
      definisjon: {
        kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
        navn: 'test',
      },
      vilkarType: {
        kode: vilkarType.FODSELSVILKARET_MOR,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[medlemAksjonspunkt, fodselAksjonspunkt]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={ytelsefordeling}
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(1);
    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });

  it('skal IKKE vise faktapanel for uttak hvis endringsdato ikke er satt', () => {
    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer={false}
      ytelsefordeling={{ ...ytelsefordeling, endringsdato: null }}
    />);
    expect(wrapper.find(UttakInfoPanel)).has.length(0);
  });


  it('skal vise faktapanel for beregning når man er overstyrer', () => {
    const wrapper = shallowWithIntl(<FaktaPanel
      aksjonspunkter={[]}
      vilkarCodes={[]}
      personopplysninger={personopplysninger}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      ytelsesType={ytelsestype}
      readOnly={false}
      fagsakPerson={person}
      erOverstyrer
      ytelsefordeling={ytelsefordeling}
    />);
    expect(wrapper.find(BeregningInfoPanel)).has.length(1);
  });
});

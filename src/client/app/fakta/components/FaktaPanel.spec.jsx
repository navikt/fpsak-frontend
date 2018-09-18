import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import vilkarType from 'kodeverk/vilkarType';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import MedlemskapInfoPanel from './medlemskap/MedlemskapInfoPanel';
import TilleggsopplysningerInfoPanel from './tilleggsopplysninger/TilleggsopplysningerInfoPanel';
import OmsorgInfoPanel from './omsorg/OmsorgInfoPanel';
import OmsorgOgForeldreansvarInfoPanel from './omsorgOgForeldreansvar/OmsorgOgForeldreansvarInfoPanel';
import AdopsjonInfoPanel from './adopsjon/AdopsjonInfoPanel';
import FodselInfoPanel from './fodsel/FodselInfoPanel';
import { FaktaPanel } from './FaktaPanel';

describe('<FaktaPanel>', () => {
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(1);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(1);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(1);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(1);
    expect(wrapper.find(FodselInfoPanel)).has.length(0);
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
    />);

    expect(wrapper.find(TilleggsopplysningerInfoPanel)).has.length(0);
    expect(wrapper.find(MedlemskapInfoPanel)).has.length(1);
    expect(wrapper.find(OmsorgInfoPanel)).has.length(0);
    expect(wrapper.find(OmsorgOgForeldreansvarInfoPanel)).has.length(0);
    expect(wrapper.find(AdopsjonInfoPanel)).has.length(0);
    expect(wrapper.find(FodselInfoPanel)).has.length(1);
  });
});

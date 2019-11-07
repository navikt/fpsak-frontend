import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

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

  xit('skal vise faktapanel for beregning når man er overstyrer', () => {
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
      featureToggleUtland
      kanOverstyre={false}
    />);
    expect(wrapper.find(BeregningInfoPanel)).has.length(1);
  });
});

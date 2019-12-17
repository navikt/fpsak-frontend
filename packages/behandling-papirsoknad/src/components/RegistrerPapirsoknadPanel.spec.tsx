import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';
import EngangsstonadPapirsoknadIndex from '@fpsak-frontend/papirsoknad-es';
import ForeldrepengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-fp';
import SvangerskapspengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-svp';

import RegistrerPapirsoknadPanel from './RegistrerPapirsoknadPanel';
import SoknadTypePickerForm from './SoknadTypePickerForm';

const fagsak = {
  saksnummer: 123456,
  fagsakYtelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: 'YTELSE_TYPE',
  },
  fagsakPerson: {
    alder: 30,
    erDod: false,
    erKvinne: true,
    navn: 'Petra',
    personnummer: '12343541',
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  fagsakStatus: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: 'FAGSAK_STATUS',
  },
};

describe('<RegistrerPapirsoknadPanel>', () => {
  it('skal vise aksjonspunkt-hjelpetekst og form for engangsstønad', () => {
    const wrapper = shallow(<RegistrerPapirsoknadPanel
      fagsak={fagsak}
      kodeverk={{}}
      readOnly={false}
      soknadData={new SoknadData('ES', 'TEST', 'TEST', [])}
      setSoknadData={sinon.spy()}
      lagreUfullstendig={sinon.spy()}
      lagreFullstendig={sinon.spy()}
    />);
    expect(wrapper.find(AksjonspunktHelpText)).to.have.length(1);
    expect(wrapper.find(SoknadTypePickerForm)).to.have.length(1);
    expect(wrapper.find(EngangsstonadPapirsoknadIndex)).to.have.length(1);
    expect(wrapper.find(ForeldrepengerPapirsoknadIndex)).to.have.length(0);
    expect(wrapper.find(SvangerskapspengerPapirsoknadIndex)).to.have.length(0);
  });

  it('skal vise foreldrepenger-form', () => {
    const wrapper = shallow(<RegistrerPapirsoknadPanel
      fagsak={fagsak}
      kodeverk={{}}
      readOnly
      soknadData={new SoknadData(fagsakYtelseType.FORELDREPENGER, 'TEST', 'TEST', [])}
      setSoknadData={sinon.spy()}
      lagreUfullstendig={sinon.spy()}
      lagreFullstendig={sinon.spy()}
    />);
    expect(wrapper.find(ForeldrepengerPapirsoknadIndex)).to.have.length(1);
    expect(wrapper.find(EngangsstonadPapirsoknadIndex)).to.have.length(0);
    expect(wrapper.find(SvangerskapspengerPapirsoknadIndex)).to.have.length(0);
  });

  it('skal vise svangerskapspenger-form', () => {
    const wrapper = shallow(<RegistrerPapirsoknadPanel
      fagsak={{
        ...fagsak,
        fagsakYtelseType: {
          kode: fagsakYtelseType.SVANGERSKAPSPENGER,
          kodeverk: 'YTELSE_TYPE',
        },
      }}
      kodeverk={{}}
      readOnly
      soknadData={new SoknadData(fagsakYtelseType.SVANGERSKAPSPENGER, 'TEST', [])}
      setSoknadData={sinon.spy()}
      lagreUfullstendig={sinon.spy()}
      lagreFullstendig={sinon.spy()}
    />);
    expect(wrapper.find(ForeldrepengerPapirsoknadIndex)).to.have.length(0);
    expect(wrapper.find(EngangsstonadPapirsoknadIndex)).to.have.length(0);
    expect(wrapper.find(SvangerskapspengerPapirsoknadIndex)).to.have.length(1);
  });
});

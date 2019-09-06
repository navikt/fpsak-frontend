import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import SoknadData from './SoknadData';
import SoknadRegistrertModal from './components/SoknadRegistrertModal';
import RegisterPapirsoknad from './components/RegistrerPapirsoknad';
import { PapirsoknadIndex } from './PapirsoknadIndex';

describe('<PapirsoknadIndex>', () => {
  const writeAccess = {
    employeeHasAccess: false,
    isEnabled: false,
  };

  const behandlingIdentifier = new BehandlingIdentifier(1, 1234);

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


  it('skal vise SoknadRegistrertModal og RegisterPapirsoknad', () => {
    const aksjonspunkter = [
      {
        id: 55,
        definisjon: {
          kode: '5016',
          navn: 'Fatter vedtak',
        },
        toTrinnsBehandling: false,
        status: {
          kode: 'OPPR',
          navn: 'Opprettet',
        },
        begrunnelse: null,
        vilkarType: null,
        kanLoses: true,
        erAktivt: true,
      },
      {
        id: 53,
        definisjon: {
          kode: '5002',
          navn: 'Avklar fødsel',
        },
        toTrinnsBehandling: true,
        status: {
          kode: 'OPPR',
          navn: 'Opprettet',
        },
        begrunnelse: 'begrunnelse fødsel',
        vilkarType: {
          kode: 'FP_VK_1',
          navn: 'Fødselsvilkåret',
        },
        kanLoses: true,
        erAktivt: true,
      },
      {
        id: 52,
        definisjon: {
          kode: '5012',
          navn: 'Registrer papirsøknad engangsstønad',
        },
        toTrinnsBehandling: true,
        status: {
          kode: 'OPPR',
          navn: 'Opprettet',
        },
        begrunnelse: 'begrunnelse papirsoknad',
        vilkarType: null,
        kanLoses: true,
        erAktivt: true,
      },
      {
        id: 54,
        definisjon: {
          kode: '5015',
          navn: 'Foreslå vedtak',
        },
        toTrinnsBehandling: false,
        status: {
          kode: 'OPPR',
          navn: 'Opprettet',
        },
        begrunnelse: null,
        vilkarType: null,
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const wrapper = shallow(<PapirsoknadIndex
      behandlingId={1234}
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      behandlingPaaVent
      submitRegistrering={sinon.spy()}
      submitRegistreringSuccess
      resetRegistrering={sinon.spy()}
      writeAccess={writeAccess}
      setSoknadData={sinon.spy()}
      soknadData={new SoknadData('ES', 'TEST', 'TEST', [])}
      resetRegistreringData={sinon.spy()}
      getFormValuesFromFormName={sinon.spy()}
      aksjonspunkter={aksjonspunkter}
      fagsakPerson={person}
    />);

    const registerPapirsoknad = wrapper.find(RegisterPapirsoknad);
    const soknadRegistrertModal = wrapper.find(SoknadRegistrertModal);
    expect(soknadRegistrertModal).to.have.length(1);
    expect(registerPapirsoknad).to.have.length(1);
  });

  it('skal kalle resetRegistreringSuccess når unmount', () => {
    const resetRegistreringSuccessFunction = sinon.spy();
    const wrapper = shallow(<PapirsoknadIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      behandlingPaaVent
      submitRegistrering={sinon.spy()}
      submitRegistreringSuccess
      resetRegistrering={sinon.spy()}
      writeAccess={writeAccess}
      setSoknadData={sinon.spy()}
      soknadData={new SoknadData('ES', 'TEST', 'TEST', [])}
      resetRegistreringData={resetRegistreringSuccessFunction}
      getFormValuesFromFormName={sinon.spy()}
      fagsakPerson={person}
    />);

    wrapper.unmount();
    expect(resetRegistreringSuccessFunction).to.have.property('callCount', 1);
  });

  it('skal kalle submitRegistrering ved submit', () => {
    const valuesForRegisteredFieldsOnly = {
      annenForelder: {
        kanIkkeOppgiAnnenForelder: false,
        fornavn: 'TEST',
        etternavn: 'TEST',
        foedselsnummer: '123453255',
      },
    };
    const submitRegistreringFunction = sinon.spy();
    const wrapper = shallow(<PapirsoknadIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      behandlingPaaVent
      submitRegistrering={submitRegistreringFunction}
      submitRegistreringSuccess
      resetRegistrering={sinon.spy()}
      writeAccess={writeAccess}
      setSoknadData={sinon.spy()}
      soknadData={new SoknadData('ES', 'TEST', 'TEST', [])}
      resetRegistreringData={sinon.spy()}
      getFormValuesFromFormName={sinon.spy()}
      fagsakPerson={person}
    />);


    wrapper.instance().onSubmit({}, sinon.spy(), valuesForRegisteredFieldsOnly);
    expect(submitRegistreringFunction).to.have.property('callCount', 1);
  });
});

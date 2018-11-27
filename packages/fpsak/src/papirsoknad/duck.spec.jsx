import { expect } from 'chai';

import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import {
  papirsoknadReducer, resetRegistrering, setSoknadData, getRegisteredFields, getPapirsoknadEnabled, getSoknadData,
} from './duck';

describe('Papirsoknad-reducer', () => {
  const expectedInitialState = {
    soknadData: null,
  };

  const mockSoknadData = {
    soknadtype: 'TEST',
    tema: 'TEST',
    soker: 'TEST',
    descriptionTextCode: 'Dette er en forklarende test',
    parentTextCode: 'Dette er en forklarende test',
  };

  it('skal returnere initial state', () => {
    expect(papirsoknadReducer(undefined, {})).to.eql(expectedInitialState);
  });

  it('skal oppdatere state med søknadsdata', () => {
    const soknadData = [mockSoknadData];

    const setAction = setSoknadData(soknadData);
    const state = papirsoknadReducer(undefined, setAction);

    expect(state.soknadData).to.eql(soknadData);
  });

  it('skal resette registreringsdata', () => {
    expect(papirsoknadReducer(mockSoknadData, resetRegistrering())).to.eql({
      soknadData: null,
    });
  });

  it('skal finne feltet til gitt form', () => {
    const formName = 'test-form';
    const formState = {
      [formName]: {
        registeredFields: { name: 'felt' },
      },
    };
    const registeredFields = getRegisteredFields(formName).resultFunc(formState);

    expect(registeredFields).is.eql({ name: 'felt' });
  });

  it('skal ikke finne feltet til gitt form', () => {
    const formName = 'test-form';
    const formState = {
      'annen-testform': {
        registeredFields: { name: 'felt' },
      },
    };
    const registeredFields = getRegisteredFields(formName).resultFunc(formState);

    expect(registeredFields).is.eql({});
  });

  it('skal vise papirsøknaden når en har et åpent papirsøknad-aksjonspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }];
    const isEnabled = getPapirsoknadEnabled.resultFunc(aksjonspunkter);

    expect(isEnabled).is.true;
  });

  it('skal ikke vise papirsøknaden når en har et lukket papirsøknad-aksjonspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
    }];
    const isEnabled = getPapirsoknadEnabled.resultFunc(aksjonspunkter);

    expect(isEnabled).is.false;
  });

  it('skal ikke vise papirsøknaden når en har et annet aksjonspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.VURDERE_DOKUMENT,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }];
    const isEnabled = getPapirsoknadEnabled.resultFunc(aksjonspunkter);

    expect(isEnabled).is.false;
  });

  it('skal hente søknadsdata fra state', () => {
    const papirsoknadContext = {
      soknadData: 'test',
    };
    const data = getSoknadData.resultFunc(papirsoknadContext);
    expect(data).is.eql('test');
  });
});

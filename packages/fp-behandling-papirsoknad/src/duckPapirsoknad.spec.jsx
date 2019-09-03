import { expect } from 'chai';

import {
  getRegisteredFields, getSoknadData, papirsoknadReducer, resetRegistrering, setSoknadData,
} from './duckPapirsoknad';

describe('Papirsoknad-reducer', () => {
  const expectedInitialState = {
    soknadData: null,
    behandlingId: undefined,
    fagsakSaksnummer: undefined,
    hasShownBehandlingPaVent: false,
    kodeverk: {},
    fagsak: {},
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
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
      kodeverk: {},
      fagsak: {},
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

  it('skal hente søknadsdata fra state', () => {
    const papirsoknadContext = {
      soknadData: 'test',
    };
    const data = getSoknadData.resultFunc(papirsoknadContext);
    expect(data).is.eql('test');
  });
});

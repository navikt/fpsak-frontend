import { expect } from 'chai';

import { isRequiredMessage } from '@fpsak-frontend/utils';
import { getBehandlingFormPrefix, getBehandlingFormRegisteredFields, hasBehandlingFormErrorsOfType } from './behandlingForm';

describe('behandlingForm', () => {
  const behandlingId = 1;
  const behandlingVersjon = 2;

  it('skal hente formens behandlingsprefix', () => {
    const prefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    expect(prefix).is.eql('behandling_1_v2');
  });

  it('skal hente formens registrerte felter', () => {
    const formName = 'testForm';
    const formState = {
      [getBehandlingFormPrefix(behandlingId, behandlingVersjon)]: {
        [formName]: {
          registeredFields: 'test',
        },
      },
    };

    const registeredFields = getBehandlingFormRegisteredFields(formName, behandlingId, behandlingVersjon)
      .resultFunc(formState);

    expect(registeredFields).is.eql('test');
  });

  it('skal sjekke at formen har minst ett felt som mangler obligatorisk verdi', () => {
    const formName = 'testForm';
    const registeredFields = {
      antallBarn: {
        name: 'antallBarn',
        count: 1,
      },
    };
    const errors = {
      antallBarn: [{
        id: 'ValidationMessage.NotEmpty',
      }],
    };

    const hasError = hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())
      .resultFunc(registeredFields, errors);

    expect(hasError).is.true;
  });

  it('skal sjekke at formen ikke har felter som mangler obligatorisk verdi', () => {
    const formName = 'testForm';
    const registeredFields = {
      antallBarn: {
        name: 'antallBarn',
        count: 1,
      },
    };
    const errors = {
      antallBarn: [{
        id: 'ValidationMessage.AnnenFeil',
      }],
    };

    const hasError = hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())
      .resultFunc(registeredFields, errors);

    expect(hasError).is.false;
  });

  it('skal sjekke at formen ikke skal sjekke felter som er skjulte for obligatoriske felter', () => {
    const formName = 'testForm';
    const registeredFields = {
      antallBarn: {
        name: 'antallBarn',
        count: 0,
      },
    };
    const errors = {
      antallBarn: [{
        id: 'ValidationMessage.NotEmpty',
      }],
    };

    const hasError = hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())
      .resultFunc(registeredFields, errors);

    expect(hasError).is.false;
  });

  it('skal kunne se at obligatorisk felt ikke er utfylt selv når felt-id er nestet', () => {
    const formName = 'testForm';
    const registeredFields = {
      'medlemskapManuellVurderingType.kode': {
        count: 1,
        name: 'medlemskapManuellVurderingType.kode',
        type: 'Field',
      },
    };

    const errors = {
      medlemskapManuellVurderingType: {
        kode: [{ id: 'ValidationMessage.NotEmpty' },
        ],
      },
    };

    const hasError = hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())
      .resultFunc(registeredFields, errors);

    expect(hasError).is.true;
  });

  it('skal kunne se at obligatorisk felt ikke er utfylt når feil-objektet er en array-struktur', () => {
    const formName = 'testForm';
    const registeredFields = {
      'fordelingTYPeriode0[0].andel': {
        count: 1,
        name: 'fordelingTYPeriode0[0].andel',
        type: 'Field',
      },
    };

    const errors = {
      fordelingTYPeriode0: [{
        andel: [{ id: 'ValidationMessage.NotEmpty' },
        ],
      }],
    };

    const hasError = hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())
      .resultFunc(registeredFields, errors);

    expect(hasError).is.true;
  });
});

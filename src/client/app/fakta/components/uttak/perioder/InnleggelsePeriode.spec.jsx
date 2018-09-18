import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { RadioGroupField } from 'form/Fields';
import sinon from 'sinon';
import uttakPeriodeVurdering from 'kodeverk/uttakPeriodeVurdering';
import { InnleggelsePeriode } from './InnleggelsePeriode';

const periode = {
  tom: '10-10-2017',
  fom: '01-10-2017',
};

const dokumentertePerioder = [{}];
const formSyncErrors = {};

describe('<InnleggelsePeriode>', () => {
  it('skal vise innleggelseperiode', () => {
    const wrapper = shallowWithIntl(<InnleggelsePeriode
      fieldId="periode[0]"
      tilDato={periode.tom}
      fraDato={periode.fom}
      resultat={undefined}
      updatePeriode={sinon.spy()}
      cancelEditPeriode={sinon.spy()}
      id="2018-06-02|2018-06-25"
      dokumentertePerioder={dokumentertePerioder}
      updated
      bekreftet
      {...reduxFormPropsMock}
      readOnly={false}
      formSyncErrors={formSyncErrors}
    />);

    const undertekst = wrapper.find('Undertekst');
    const radioGroupField = wrapper.find('RadioGroupField');
    const radioGroupFieldComponent = wrapper.find(RadioGroupField).dive();
    expect(radioGroupFieldComponent.children()).to.have.length(2);
    expect(undertekst).to.have.length(1);
    expect(radioGroupField).to.have.length(1);
  });

  it('Skal vise tekstfelt hvis resultat er true', () => {
    const wrapper = shallowWithIntl(<InnleggelsePeriode
      fieldId="periode[0]"
      tilDato={periode.tom}
      fraDato={periode.fom}
      resultat={uttakPeriodeVurdering.PERIODE_OK}
      updatePeriode={sinon.spy()}
      cancelEditPeriode={sinon.spy()}
      id="2018-06-02|2018-06-25"
      dokumentertePerioder={dokumentertePerioder}
      updated
      bekreftet
      {...reduxFormPropsMock}
      readOnly={false}
      formSyncErrors={formSyncErrors}
    />);

    const textAreaField = wrapper.find('TextAreaField');
    expect(textAreaField).to.have.length(1);
  });
});

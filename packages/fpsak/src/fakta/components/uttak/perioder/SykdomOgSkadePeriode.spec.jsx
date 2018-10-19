import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { RadioGroupField } from 'form/Fields';
import uttakPeriodeVurdering from 'kodeverk/uttakPeriodeVurdering';
import sinon from 'sinon';
import { SykdomOgSkadePeriode } from './SykdomOgSkadePeriode';

const dokumentertePerioder = [{}];
const formSyncErrors = {};
const periode = {
  tom: '10-10-2017',
  fom: '01-10-2017',
};

describe('<SykdomOgSkadePeriode>', () => {
  it('skal vise sykdom og skade periode', () => {
    const wrapper = shallowWithIntl(<SykdomOgSkadePeriode
      fieldId="periode[0]"
      tilDato={periode.tom}
      fraDato={periode.fom}
      resultat={uttakPeriodeVurdering.PERIODE_IKKE_VURDERT}
      updatePeriode={sinon.spy()}
      cancelEditPeriode={sinon.spy()}
      id="2018-06-02|2018-06-25"
      updated
      bekreftet
      dokumentertePerioder={dokumentertePerioder}
      utsettelseArsak={{}}
      overforingArsak={{}}
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
    const wrapper = shallowWithIntl(<SykdomOgSkadePeriode
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
      utsettelseArsak={{}}
      overforingArsak={{}}
      {...reduxFormPropsMock}
      readOnly={false}
      formSyncErrors={formSyncErrors}
    />);
    const textAreaField = wrapper.find('TextAreaField');
    expect(textAreaField).to.have.length(1);
  });
});

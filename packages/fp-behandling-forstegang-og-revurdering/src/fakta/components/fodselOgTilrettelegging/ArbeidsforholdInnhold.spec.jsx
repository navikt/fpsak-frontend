import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import {
  DatepickerField,
} from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import ArbeidsforholdCheckboxes from './ArbeidsforholdCheckboxes';
import { ArbeidsforholdInnhold, buildInitialValues } from './ArbeidsforholdInnhold';

describe('<ArbeidsforholdInnhold>', () => {
  const selectedArbeidsforhold = {
    tilretteleggingBehovFom: '2019-04-18',
    arbeidsgiverNavn: 'Xansen flyttebyrå AS',
    arbeidsgiverIdent: 1234,
    kanGjennomfores: {
      kanGjennomfores: true,
      dato: '2019-05-30',
    },
    kanIkkeGjennomfores: {
      kanIkkeGjennomfores: false,
      dato: '',
    },
    redusertArbeid: {
      redusertArbeid: true,
      dato: '2019-04-18',
      stillingsprosent: 50,
    },
    begrunnelse: '',
  };
  it('skal vise faktaform med liste av arbeidsforhold readonly', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdInnhold
      readOnly
      cancelArbeidsforholdCallback={sinon.spy()}
      updateArbeidsforholdCallback={sinon.spy()}
    />);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const arbforholdCheckboxes = wrapper.find(ArbeidsforholdCheckboxes);
    expect(arbforholdCheckboxes).has.length(1);
    const oppdaterKnapp = wrapper.find(Hovedknapp);
    expect(oppdaterKnapp).has.length(0);
    const avbrytKnapp = wrapper.find(Knapp);
    expect(avbrytKnapp).has.length(0);
  });
  it('skal vise faktaform med liste av arbeidsforhold ikke readonly', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdInnhold
      readOnly={false}
      cancelArbeidsforholdCallback={sinon.spy()}
      updateArbeidsforholdCallback={sinon.spy()}
    />);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const arbforholdCheckboxes = wrapper.find(ArbeidsforholdCheckboxes);
    expect(arbforholdCheckboxes).has.length(1);
    const oppdaterKnapp = wrapper.find(Hovedknapp);
    expect(oppdaterKnapp).has.length(1);
    const avbrytKnapp = wrapper.find(Knapp);
    expect(avbrytKnapp).has.length(1);
  });
  it('skal sette opp initial values', () => {
    const initialValues = buildInitialValues(selectedArbeidsforhold);
    expect(initialValues).to.eql({
      jordmorTilretteleggingFra: '2019-04-18',
      begrunnelse: '',
      kanGjennomfores: false,
      kanGjennomforesDato: undefined,
      kanIkkeGjennomfores: false,
      kanIkkeGjennomforesDato: undefined,
      redusertArbeid: false,
      redusertArbeidDato: undefined,
      redusertArbeidStillingsprosent: undefined,
    });
  });
});

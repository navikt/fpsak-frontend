import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import {
  DatepickerField,
} from '@fpsak-frontend/form';
import { Knapp } from 'nav-frontend-knapper';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import TilretteleggingFaktaPanel from './tilrettelegging/TilretteleggingFaktaPanel';
import { ArbeidsforholdDetailForm, buildInitialValues } from './ArbeidsforholdDetailForm';

describe('<ArbeidsforholdDetailForm>', () => {
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
    tilretteleggingDatoer: [],
  };
  it('skal vise faktaform med liste av arbeidsforhold readonly', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdDetailForm
      readOnly
      cancelArbeidsforholdCallback={sinon.spy()}
      updateArbeidsforholdCallback={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-04-04"
      tilretteleggingDatoer={[]}
    />);
    expect(wrapper.find(DatepickerField)).has.length(1);
    expect(wrapper.find(TilretteleggingFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(0);
    expect(wrapper.find(Knapp)).has.length(0);
  });
  it('skal vise faktaform med liste av arbeidsforhold ikke readonly', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdDetailForm
      readOnly={false}
      cancelArbeidsforholdCallback={sinon.spy()}
      updateArbeidsforholdCallback={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-04-04"
      tilretteleggingDatoer={[]}
    />);
    expect(wrapper.find(DatepickerField)).has.length(1);
    expect(wrapper.find(TilretteleggingFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
    expect(wrapper.find(Knapp)).has.length(1);
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
      tilretteleggingDatoer: [],
    });
  });
});

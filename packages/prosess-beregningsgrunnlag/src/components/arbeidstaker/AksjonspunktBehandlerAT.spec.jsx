import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AksjonspunktBehandlerAT from './AksjonspunktBehandlerAT';
import {formatCurrencyNoKr} from '@fpsak-frontend/utils';


const alleKodeverk = {
  test: 'test',
};

const mockAndel = (arbeidsgiverNavn, overstyrtPrAar, beregnetPrAar) => ({
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
  },
  arbeidsforhold: {
    arbeidsgiverNavn,
    arbeidsgiverId: '123',
    arbeidsforholdId: '123',
    eksternArbeidsforholdId: '345678',
    startdato: '2018-10-09',
  },
  beregnetPrAar,
  overstyrtPrAar,
});
describe('<AksjonspunktBehandlerAT>', () => {
  it('Skal teste tabellen får korrekte rader readonly=false', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 100, 200000, false)];
    const wrapper = shallowWithIntl(<AksjonspunktBehandlerAT
      readOnly={false}
      alleAndelerIForstePeriode={andeler}
      alleKodeverk={alleKodeverk}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(andeler.length);
    andeler.forEach((andel, index) => {
      const arbeidsgiverNavn = rows.at(index).find('Normaltekst');
      expect(arbeidsgiverNavn.at(0).childAt(0).text()).to.equal(`${andel.arbeidsforhold.arbeidsgiverNavn} (123)...5678`);
      const inputField = rows.first().find('InputField');
      expect(inputField).to.have.length(1);
      expect(inputField.props().readOnly).to.equal(false);
    });
  });

  it('Skal teste tabellen får korrekte rader readonly=true', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 100, 200000, false)];
    const wrapper = shallowWithIntl(<AksjonspunktBehandlerAT
      readOnly
      alleAndelerIForstePeriode={andeler}
      alleKodeverk={alleKodeverk}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(andeler.length);
    andeler.forEach((andel, index) => {
      const arbeidsgiverNavn = rows.at(index).find('Normaltekst');
      expect(arbeidsgiverNavn.at(0).childAt(0).text()).to.equal(`${andel.arbeidsforhold.arbeidsgiverNavn} (123)...5678`);
      const inputField = rows.first().find('InputField');
      expect(inputField).to.have.length(1);
      expect(inputField.props().readOnly).to.equal(true);
    });
  });
  it('Skal teste transformValues metode', () => {
    const expectedInitialValues = {};

const values={
  ATFLVurdering: "Dette er begrunnelsen for den skjønnsmessige faSTSETTELSEN av avvik."
  begrunnDekningsgradEndring: ""
  dekningsgrad: undefined
  inntekt0: "214 000"
  inntektField_null_2_2019-10-26: "214 000"
    inntektFrilanser: "100 000"
}
    const transformedValues = AksjonspunktBehandlerAT.buildInitialValues(values,relevanteStatuser, alleAndelerIForstePeriode);
    expect(initialValues).is.deep.equal(expectedInitialValues);
  });
});

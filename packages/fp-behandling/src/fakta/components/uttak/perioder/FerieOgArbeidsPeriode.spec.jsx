import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { RadioGroupField } from '@fpsak-frontend/form';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import sinon from 'sinon';
import { FerieOgArbeidsPeriode } from './FerieOgArbeidsPeriode';

const arbeidsgiver = {};
const behandlingStatusKode = '';

describe('<FerieOgArbeidsPeriode>', () => {
  it('skal vise ferie og arbeids periode', () => {
    const wrapper = shallowWithIntl(<FerieOgArbeidsPeriode
      fieldId="periode[0]"
      resultat={undefined}
      updatePeriode={sinon.spy()}
      cancelEditPeriode={sinon.spy()}
      id="2018-06-02|2018-06-25"
      fraDato="2018-06-02"
      tilDato="2018-06-25"
      uttakPeriodeType={{}}
      updated
      bekreftet
      readOnly={false}
      behandlingStatusKode={behandlingStatusKode}
      arbeidsgiver={arbeidsgiver}
      utsettelseArsak={{
        kode: 'ARBEID',
      }}
      skalViseResultat
      oppholdArsak={{}}
      inntektsmeldinger={[{
        arbeidsgiver: 'test',
        arbeidsgiverStartdato: '2000-01-01',
        utsettelsePerioder: [{
          fom: '2000-01-01',
          tom: '2000-01-10',
          utsettelseArsak: {
            kode: 'ARBEID',
            kodeverk: 'UTSETTELSE_AARSAK_TYPE',
            navn: 'Arbeid',
          },
        }],
      }]}
      {...reduxFormPropsMock}
    />);

    const undertekst = wrapper.find('Undertekst');
    const radioGroupField = wrapper.find('RadioGroupField');
    const textAreaField = wrapper.find('TextAreaField');
    const radioGroupFieldComponent = wrapper.find(RadioGroupField).dive();
    expect(radioGroupFieldComponent.children()).to.have.length(3);
    expect(textAreaField).to.have.length(1);
    expect(undertekst).to.have.length(1);
    expect(radioGroupField).to.have.length(1);
  });
});
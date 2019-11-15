import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SelectField, InputField } from '@fpsak-frontend/form';

import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';
import vergeType from '../kodeverk/vergeType';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-verge';

const vergetyper = [{
  kode: vergeType.BARN,
  navn: 'Barn',
}, {
  kode: vergeType.ANNEN_F,
  navn: 'Annen foreldre',
}];

describe('<RegistrereVergeFaktaForm>', () => {
  it('skal vise kun dropdown for vergetype når dette ikke er satt', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeFaktaForm
      intl={intlMock}
      readOnly={false}
      vergetyper={vergetyper}
      alleMerknaderFraBeslutter={{}}
    />);

    expect(wrapper.find(SelectField)).to.have.length(1);
    expect(wrapper.find(InputField)).to.have.length(0);
  });

  it('skal vise alle felter når dette vergetype er valgt', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeFaktaForm
      intl={intlMock}
      readOnly={false}
      vergetyper={vergetyper}
      alleMerknaderFraBeslutter={{}}
      valgtVergeType={vergeType.BARN}
    />);

    expect(wrapper.find(SelectField)).to.have.length(1);
    expect(wrapper.find(InputField)).to.have.length(2);
  });

  it('skal sette opp initielle verdier fra behandling', () => {
    const verge = {
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      fnr: '1234',
      vergeType: { kode: vergeType.BARN },
    };

    const initialValues = RegistrereVergeFaktaForm.buildInitialValues(verge);

    expect(initialValues).to.eql({
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      fnr: '1234',
      organisasjonsnummer: undefined,
      vergeType: vergeType.BARN,
    });
  });
});

import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import DatepickerField from 'form/fields/DatepickerField';
import SelectField from 'form/fields/SelectField';
import InputField from 'form/fields/InputField';
import CheckboxField from 'form/fields/CheckboxField';
import DecimalField from 'form/fields/DecimalField';
import { MockFields, metaMock } from 'testHelpers/redux-form-test-helper';
import { RenderGraderingPeriodeFieldArray } from './RenderGraderingPeriodeFieldArray';

const graderingKvoter = [{ navn: 'Mødrekvote', kode: 'MODREKVOTE' }];

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<RenderGraderingPeriodeFieldArray>', () => {
  it('skal vise 2 inputfelter for dato og 2 nedtrekkslister uten sletteknapp ved periodeliste med en eksisterende periode', () => {
    const tomError = [false];
    const fomError = [false];
    const orgNr = [false];
    const periodeForGraderingError = [false];
    const prosentandelArbeidError = [false];
    const errors = [false];

    const wrapper = shallowWithIntl(<RenderGraderingPeriodeFieldArray
      fields={fields}
      meta={metaMock}
      intl={intlMock}
      graderingKvoter={graderingKvoter}
      tomError={tomError}
      orgNrError={orgNr}
      fomError={fomError}
      periodeForGraderingError={periodeForGraderingError}
      prosentandelArbeidError={prosentandelArbeidError}
      errors={errors}
      readOnly={false}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);
    expect(innerWrapper.find(SelectField)).has.length(2);
    expect(innerWrapper.find(InputField)).has.length(1);
    expect(innerWrapper.find(DecimalField)).has.length(1);
    expect(innerWrapper.find(CheckboxField)).has.length(2);
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });
});

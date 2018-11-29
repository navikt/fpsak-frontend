import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { expect } from 'chai';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import DatepickerField from 'form/fields/DatepickerField';
import SelectField from 'form/fields/SelectField';
import InputField from 'form/fields/InputField';
import CheckboxField from 'form/fields/CheckboxField';
import DecimalField from 'form/fields/DecimalField';
import { MockFields, metaMock } from '@fpsak-frontend/assets/testHelpers//redux-form-test-helper';
import { RenderGraderingPeriodeFieldArray } from './RenderGraderingPeriodeFieldArray';

const graderingKvoter = [{ navn: 'Mødrekvote', kode: 'MODREKVOTE' }];

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<RenderGraderingPeriodeFieldArray>', () => {
  it('skal vise felter for gradering, samtidig uttak ikke valgt', () => {
    const wrapper = shallowWithIntl(<RenderGraderingPeriodeFieldArray
      fields={fields}
      meta={metaMock}
      intl={intlMock}
      graderingKvoter={graderingKvoter}
      readOnly={false}
      graderingValues={[{
        harSamtidigUttak: '',
      },
      ]}
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
    expect(innerWrapper.find(CheckboxField)).has.length(3);
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });

  it('skal vise felter for gradering, samtidig uttak valgt', () => {
    const wrapper = shallowWithIntl(<RenderGraderingPeriodeFieldArray
      fields={fields}
      meta={metaMock}
      intl={intlMock}
      graderingKvoter={graderingKvoter}
      readOnly={false}
      graderingValues={[{
        harSamtidigUttak: true,
      },
      ]}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);
    expect(innerWrapper.find(SelectField)).has.length(2);
    expect(innerWrapper.find(InputField)).has.length(1);
    expect(innerWrapper.find(DecimalField)).has.length(2);
    expect(innerWrapper.find(CheckboxField)).has.length(3);
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });
});

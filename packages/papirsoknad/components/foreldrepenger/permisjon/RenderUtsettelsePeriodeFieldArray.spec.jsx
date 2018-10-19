import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import DatepickerField from 'form/fields/DatepickerField';
import SelectField from 'form/fields/SelectField';
import { MockFields, metaMock } from 'testHelpers/redux-form-test-helper';
import { RenderUtsettelsePeriodeFieldArray } from './RenderUtsettelsePeriodeFieldArray';

const utsettelseReasons = [{ navn: 'Grunn1', kode: 'Grunn1' }];
const utsettelseKvoter = [{ navn: 'Mødrekvote', kode: 'MODREKVOTE' }];

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<RenderUtsettelsePeriodeFieldArray>', () => {
  it('skal vise 2 inputfelter for dato og 3 nedtrekkslister uten sletteknapp ved periodeliste med en eksisterende periode', () => {
    const wrapper = shallowWithIntl(<RenderUtsettelsePeriodeFieldArray
      fields={fields}
      meta={metaMock}
      utsettelseReasons={utsettelseReasons}
      utsettelseKvoter={utsettelseKvoter}
      formatMessage={sinon.spy()}
      intl={intlMock}
      readOnly={false}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const dateFields = innerWrapper.find(DatepickerField);
    expect(dateFields).has.length(2);
    expect(dateFields.first().prop('name')).is.eql('fieldId1.periodeFom');
    expect(dateFields.first().prop('label')).is.eql({ id: 'Registrering.Permisjon.periodeFom' });
    expect(dateFields.last().prop('name')).is.eql('fieldId1.periodeTom');
    expect(dateFields.last().prop('label')).is.eql({ id: 'Registrering.Permisjon.periodeTom' });
    expect(innerWrapper.find('#avslutt')).has.length(1);

    expect(innerWrapper.find(SelectField)).has.length(3);
  });
});

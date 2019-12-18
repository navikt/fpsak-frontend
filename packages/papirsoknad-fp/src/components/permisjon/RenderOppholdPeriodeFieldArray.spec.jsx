import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { metaMock, MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { RenderOppholdPeriodeFieldArray } from './RenderOppholdPeriodeFieldArray';

const oppholdsReasons = [{ navn: 'Grunn1', kode: 'Grunn1' }];
const uttaksKvoter = [{ navn: 'Mødrekvote', kode: 'MODREKVOTE' }];

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<RenderOppholdPeriodeFieldArray>', () => {
  it('skal vise 2 inputfelter for dato og 1 nedtrekkslister uten sletteknapp ved periodeliste med en eksisterende periode', () => {
    const wrapper = shallowWithIntl(<RenderOppholdPeriodeFieldArray
      fields={fields}
      meta={metaMock}
      oppholdsReasons={oppholdsReasons}
      uttaksKvoter={uttaksKvoter}
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

    expect(innerWrapper.find(SelectField)).has.length(1);
  });
});

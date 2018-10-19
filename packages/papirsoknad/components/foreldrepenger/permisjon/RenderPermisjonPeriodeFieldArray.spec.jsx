import React from 'react';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import moment from 'moment';
import { expect } from 'chai';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { DatepickerField, SelectField } from 'form/Fields';
import { metaMock, MockFields } from 'testHelpers/redux-form-test-helper';
import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { dateRangesOverlappingMessage, invalidDateMessage } from 'utils/validation/messages';
import uttakPeriodeType from 'kodeverk/uttakPeriodeType';
import RenderPermisjonPeriodeFieldArray, { RenderPermisjonPeriodeFieldArray as RenderPermisjonPeriodeFieldArrayImpl } from './RenderPermisjonPeriodeFieldArray';


const periodeTyper = [{ navn: 'FELLESPERIODE', kode: uttakPeriodeType.FELLESPERIODE },
  { navn: 'MODREKVOTE', kode: uttakPeriodeType.MODREKVOTE },
  { navn: 'FEDREKVOTE', kode: uttakPeriodeType.FEDREKVOTE },
  { navn: 'FORELDREPENGER_FOR_FODSEL', kode: uttakPeriodeType.FORELDREPENGER_FOR_FODSEL }];

const fields = new MockFields('perioder', 1);
const readOnly = false;

describe('<RenderPermisjonPeriodeFieldArray>', () => {
  it('skal vise felter uten mors aktivitet med en eksisterende periode når søker er mor', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor
      selectedPeriodeTyper={[]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    const dateFields = innerWrapper.find(DatepickerField);
    expect(dateFields).has.length(2);
    expect(dateFields.first().prop('name')).is.eql('fieldId1.periodeFom');
    expect(dateFields.first().prop('label')).is.eql({ id: 'Registrering.Permisjon.periodeFom' });
    expect(dateFields.last().prop('name')).is.eql('fieldId1.periodeTom');
    expect(dateFields.last().prop('label')).is.eql({ id: 'Registrering.Permisjon.periodeTom' });

    expect(innerWrapper.find(SelectField)).has.length(1);
  });

  it('skal vise felter med mors aktivitet med en eksisterende periode når søker er far', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor={false}
      selectedPeriodeTyper={[]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);

    expect(innerWrapper.find(SelectField)).has.length(2);
  });

  it('skal vise felter med mors aktivitet disbaled søker er far og fedrekvote er valgt', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor={false}
      selectedPeriodeTyper={[uttakPeriodeType.FEDREKVOTE]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);

    const selectFields = innerWrapper.find(SelectField);
    expect(selectFields).has.length(2);

    expect(selectFields.last().prop('disabled')).is.true;
  });


  it('skal vise felter med mors aktivitet disbaled søker er far og mødrekvote er valgt', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor={false}
      selectedPeriodeTyper={[uttakPeriodeType.MODREKVOTE]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);

    const selectFields = innerWrapper.find(SelectField);
    expect(selectFields).has.length(2);

    expect(selectFields.last().prop('disabled')).is.true;
  });

  it('skal vise felter med mors aktivitet disbaled søker er far og ingen periode er valgt', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor={false}
      selectedPeriodeTyper={[]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);

    const selectFields = innerWrapper.find(SelectField);
    expect(selectFields).has.length(2);

    expect(selectFields.last().prop('disabled')).is.true;
  });

  it('skal vise felter med mors aktivitet disbaled søker er far og foreldrepenger før fødsel er valgt', () => {
    const wrapper = shallowWithIntl(<RenderPermisjonPeriodeFieldArrayImpl
      fields={fields}
      meta={metaMock}
      periodeTyper={periodeTyper}
      morsAktivitetTyper={[]}
      sokerErMor={false}
      selectedPeriodeTyper={[uttakPeriodeType.FORELDREPENGER_FOR_FODSEL]}
      readOnly={readOnly}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0);
    const innerWrapper = shallowWithIntl(comp);

    expect(innerWrapper.find(DatepickerField)).has.length(2);

    const selectFields = innerWrapper.find(SelectField);
    expect(selectFields).has.length(2);

    expect(selectFields.last().prop('disabled')).is.true;
  });

  const getPeriodDaysFromToday = (periodeType, startDaysFromToday, endDaysFromToday) => ({
    periodeType,
    periodeFom: moment().add(startDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    periodeTom: moment().add(endDaysFromToday, 'days').format(ISO_DATE_FORMAT),
  });

  const getPeriod = (periodeType, periodeFom, periodeTom) => ({ periodeType, periodeFom, periodeTom });


  it('skal validere at alle perioder har gyldige datoer', () => {
    const errorsWithInvalidDates = RenderPermisjonPeriodeFieldArray.validate([getPeriod('FELLESPERIODE', 'abc', 'xyz'),
      getPeriodDaysFromToday('FELLESPERIODE', -20, -15)], []);
    const errorsWithValidDates = RenderPermisjonPeriodeFieldArray.validate([getPeriodDaysFromToday('FELLESPERIODE', -10, -5),
      getPeriodDaysFromToday('FELLESPERIODE', -20, -15)], []);

    expect(errorsWithInvalidDates).to.be.an('array');
    expect(errorsWithInvalidDates[0].periodeFom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[0].periodeTom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[1]).to.not.exist;

    expect(errorsWithValidDates).to.not.exist;
  });

  it('skal validere at ingen perioder overlapper', () => {
    const errorsWithInvalidDates = RenderPermisjonPeriodeFieldArray.validate([getPeriodDaysFromToday('FELLESPERIODE', -20, -15),
      getPeriodDaysFromToday('FELLESPERIODE', -16, -11)], []);
    const errorsWithValidDates = RenderPermisjonPeriodeFieldArray.validate([getPeriodDaysFromToday('FELLESPERIODE', -20, -15),
      getPeriodDaysFromToday('FELLESPERIODE', -14, -10)], []);

    expect(errorsWithInvalidDates).to.be.an('object');
    // eslint-disable-next-line no-underscore-dangle
    expect(errorsWithInvalidDates._error).to.be.an('array').that.eql(dateRangesOverlappingMessage());

    expect(errorsWithValidDates).to.not.exist;
  });
});

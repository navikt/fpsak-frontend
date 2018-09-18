import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { metaMock, MockFields } from 'testHelpers/redux-form-test-helper';

import { DatepickerField } from 'form/Fields';
import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import FrilansOppdragForFamilieFieldArray from './FrilansOppdragForFamilieFieldArray';

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<FrilansOppdragForFamilieFieldArray>', () => {
  it('Skal rendre FrilansOppdragForFamilieFieldArray', () => {
    const wrapper = shallow(<FrilansOppdragForFamilieFieldArray
      fields={fields}
      meta={metaMock}
      readOnly={false}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallow(comp);

    const dateFields = innerWrapper.find(DatepickerField);
    expect(dateFields).has.length(2);
    expect(dateFields.first().prop('name')).is.eql('fieldId1.fomDato');
    expect(dateFields.first().prop('label')).is.eql({ id: 'Registrering.FrilansOppdrag.FieldArray.periodeFom' });
    expect(dateFields.last().prop('name')).is.eql('fieldId1.tomDato');
    expect(dateFields.last().prop('label')).is.eql({ id: 'Registrering.FrilansOppdrag.FieldArray.periodeTom' });
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });

  it('Skal ikke feile når fomDato er etter tomDato', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2018-10-10',
        tomDato: '2018-11-10',
      }],
      perioder: [{
        periodeFom: '',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.null;
  });

  it('Skal ikke feile når fomDato er lik tomDato', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2018-10-10',
        tomDato: '2018-10-10',
      }],
      perioder: [{
        periodeFom: '',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.null;
  });

  it('Skal feile når fomDato er før tomDato', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2018-10-10',
        tomDato: '2018-06-10',
      }],
      perioder: [{
        periodeFom: '',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.eql([{
      tomDato: [{
        id: 'ValidationMessage.DateNotAfterOrEqual',
      }, {
        limit: '10.10.2018',
      }],
    }]);
  });

  it('Skal ikke feile når fomDato er etter første periodeFom', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2018-01-05',
        tomDato: '2018-10-10',
      }],
      perioder: [{
        periodeFom: '2018-01-10',
      }, {
        periodeFom: '2018-01-01',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.null;
  });

  it('Skal ikke feile når fomDato er lik første periodeFom', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2018-01-01',
        tomDato: '2018-10-10',
      }],
      perioder: [{
        periodeFom: '2018-01-10',
      }, {
        periodeFom: '2018-01-01',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.null;
  });

  it('Skal feile når fomDato er før første periodeFom', () => {
    const values = {
      oppdragPerioder: [{
        fomDato: '2017-12-31',
        tomDato: '2018-10-10',
      }],
      perioder: [{
        periodeFom: '2018-01-10',
      }, {
        periodeFom: '2018-01-01',
      }],
    };

    const res = FrilansOppdragForFamilieFieldArray.validate(values);
    expect(res).is.eql([{
      fomDato: [{
        id: 'Registrering.FrilansOppdrag.FieldArray.BeforeFomValidation',
      }],
    }]);
  });
});

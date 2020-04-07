import React from 'react';
import { FormattedMessage } from 'react-intl';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { metaMock, MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';

import { TilretteleggingFieldArray, finnUtbetalingsgradForDelvisTilrettelegging } from './TilretteleggingFieldArray';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<TilretteleggingFieldArray>', () => {
  it('skal vise tilrettelegging fields med tittel for index 0', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArray
      intl={intlMock}
      fields={new MockFields()}
      meta={metaMock}
      readOnly={false}
      formSectionName="FORM_SECTION_NAME"
      erOverstyrer
      changeField={() => undefined}
      tilretteleggingDatoer={[]}
      stillingsprosentArbeidsforhold={50}
      setOverstyrtUtbetalingsgrad={() => undefined}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('- Velg tilretteleggingsbehov -');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    expect(innerWrapper.find('#avslutt')).has.length(1);
  });

  it('skal vise tilrettelegging fields uten tittel for index 1', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArray
      intl={intlMock}
      fields={new MockFields()}
      meta={metaMock}
      readOnly={false}
      formSectionName="FORM_SECTION_NAME"
      erOverstyrer
      changeField={() => undefined}
      tilretteleggingDatoer={[]}
      stillingsprosentArbeidsforhold={50}
      setOverstyrtUtbetalingsgrad={() => undefined}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 1, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('- Velg tilretteleggingsbehov -');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    const formattedMessages = innerWrapper.find(FormattedMessage);
    expect(formattedMessages).has.length(0);

    expect(innerWrapper.find('#avslutt')).has.length(1);
  });

  it('skal ikke vise getRemoveButtno i readOnly modus', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArray
      intl={intlMock}
      fields={new MockFields()}
      meta={metaMock}
      readOnly
      formSectionName="FORM_SECTION_NAME"
      erOverstyrer
      changeField={() => undefined}
      tilretteleggingDatoer={[]}
      stillingsprosentArbeidsforhold={50}
      setOverstyrtUtbetalingsgrad={() => undefined}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 1, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('- Velg tilretteleggingsbehov -');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    const formattedMessages = innerWrapper.find(FormattedMessage);
    expect(formattedMessages).has.length(0);

    expect(innerWrapper.find('#avslutt')).has.length(0);
  });

  it('skal finnne utbetalingsgrad for delvis tilrettelegging - eks. 1', () => {
    const stillingsprosent = 70;
    const stillingsprosentArbeidsgiver = 70;

    const utbetalingsgrad = finnUtbetalingsgradForDelvisTilrettelegging(stillingsprosentArbeidsgiver, stillingsprosent);

    expect(utbetalingsgrad).is.eql('0');
  });

  it('skal finnne utbetalingsgrad for delvis tilrettelegging - eks. 2', () => {
    const stillingsprosent = 70;
    const stillingsprosentArbeidsgiver = 30;

    const utbetalingsgrad = finnUtbetalingsgradForDelvisTilrettelegging(stillingsprosentArbeidsgiver, stillingsprosent);

    expect(utbetalingsgrad).is.eql('0');
  });
});

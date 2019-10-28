import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { metaMock, MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { expect } from 'chai';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { FormattedMessage } from 'react-intl';
import { TilretteleggingFieldArray } from './TilretteleggingFieldArray';

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<TilretteleggingFieldArray>', () => {
  it('skal vise tilrettelegging fields med tittel for index 0', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArray
      intl={intlMock}
      fields={new MockFields()}
      meta={metaMock}
      readOnly={false}
      formSectionName="FORM_SECTION_NAME"
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('TilretteleggingFieldArray.VelgTilretteleggingPlaceholder');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    const tilretteleggingFieldArrayStillingsprosentImpl = innerWrapper.find('Connect(TilretteleggingFieldArrayStillingsprosent)');
    expect(tilretteleggingFieldArrayStillingsprosentImpl).has.length(1);

    const formattedMessages = innerWrapper.find(FormattedMessage);
    expect(formattedMessages).has.length(3);
    expect(formattedMessages.get(0).props.id).to.eql('TilretteleggingFieldArray.BehovForTilrettelegging');
    expect(formattedMessages.get(1).props.id).to.eql('TilretteleggingFieldArray.Dato');
    expect(formattedMessages.get(2).props.id).to.eql('TilretteleggingFieldArray.Stillingsprosent');

    expect(innerWrapper.find('#avslutt')).has.length(1);
  });
  it('skal vise tilrettelegging fields uten tittel for index 1', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArray
      intl={intlMock}
      fields={new MockFields()}
      meta={metaMock}
      readOnly={false}
      formSectionName="FORM_SECTION_NAME"
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 1, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('TilretteleggingFieldArray.VelgTilretteleggingPlaceholder');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    const tilretteleggingFieldArrayStillingsprosentImpl = innerWrapper.find('Connect(TilretteleggingFieldArrayStillingsprosent)');
    expect(tilretteleggingFieldArrayStillingsprosentImpl).has.length(1);

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
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 1, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const selectField = innerWrapper.find(SelectField);
    expect(selectField).has.length(1);
    expect(selectField.props().placeholder).to.eql('TilretteleggingFieldArray.VelgTilretteleggingPlaceholder');
    expect(selectField.props().selectValues).has.length(3);
    expect(selectField.props().selectValues[0].key).to.eql('HEL_TILRETTELEGGING');
    expect(selectField.props().selectValues[1].key).to.eql('DELVIS_TILRETTELEGGING');
    expect(selectField.props().selectValues[2].key).to.eql('INGEN_TILRETTELEGGING');

    const datepickerField = innerWrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);

    const tilretteleggingFieldArrayStillingsprosentImpl = innerWrapper.find('Connect(TilretteleggingFieldArrayStillingsprosent)');
    expect(tilretteleggingFieldArrayStillingsprosentImpl).has.length(1);

    const formattedMessages = innerWrapper.find(FormattedMessage);
    expect(formattedMessages).has.length(0);

    expect(innerWrapper.find('#avslutt')).has.length(0);
  });
});

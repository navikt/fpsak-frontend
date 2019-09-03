import React from 'react';
import DayPicker from 'react-day-picker';
import { expect } from 'chai';
import sinon from 'sinon';

import { dateFormat } from '@fpsak-frontend/utils';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import CalendarOverlay from './CalendarOverlay';

const disabledDays = {};

describe('<CalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      value="21.08.2017"
      numberOfMonths={1}
      disabledDays={disabledDays}
      disabled
    />);

    expect(wrapper.find(DayPicker)).to.have.length(0);
  });

  it('skal vise overlay', () => {
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      numberOfMonths={1}
      disabledDays={disabledDays}
      elementIsCalendarButton={sinon.spy()}
      value="21.08.2017"
    />);

    const daypicker = wrapper.find(DayPicker);
    expect(daypicker).to.have.length(1);
    expect(daypicker.prop('months')).is.eql(['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli',
      'August', 'September', 'Oktober', 'November', 'Desember']);
    expect(daypicker.prop('weekdaysLong')).is.eql(['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']);
    expect(daypicker.prop('weekdaysShort')).is.eql(['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']);
    expect(daypicker.prop('firstDayOfWeek')).is.eql(1);
    expect(dateFormat(daypicker.prop('selectedDays'))).is.eql('21.08.2017');
  });

  it('skal ikke sette dato når denne ikke er korrekt', () => {
    const onDayChangeCallback = sinon.spy();
    const date = '21.sd.2017';
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={onDayChangeCallback}
      className="test"
      dayPickerClassName="test"
      numberOfMonths={1}
      disabledDays={disabledDays}
      elementIsCalendarButton={sinon.spy()}
      value={date}
      onClose={sinon.spy()}
    />);

    const daypicker = wrapper.find(DayPicker);
    expect(daypicker.prop('selectedDays')).is.null;
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', (done) => {
    const onCloseCallback = () => {
      expect(true).is.true;
      done();
    };
    const elementIsCalendarButton = () => false;
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      numberOfMonths={1}
      disabledDays={disabledDays}
      elementIsCalendarButton={elementIsCalendarButton}
      value="21.08.2017"
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onBlur')('test');
  });

  it('skal kjøre callback når en trykker escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      numberOfMonths={1}
      disabledDays={disabledDays}
      elementIsCalendarButton={sinon.spy()}
      value="21.08.2017"
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onKeyDown')({ keyCode: 27 });

    expect(onCloseCallback.called).is.true;
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(<CalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      numberOfMonths={1}
      disabledDays={disabledDays}
      elementIsCalendarButton={sinon.spy()}
      value="21.08.2017"
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onKeyDown')({ keyCode: 20 });

    expect(onCloseCallback.called).is.false;
  });
});

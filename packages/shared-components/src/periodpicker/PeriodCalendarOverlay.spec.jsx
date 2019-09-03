import React from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import PeriodCalendarOverlay from './PeriodCalendarOverlay';

describe('<PeriodCalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment().toDate()}
      endDate={moment().toDate()}
      disabledDays={{}}
      disabled
    />);

    expect(wrapper.find(DayPicker)).to.have.length(0);
  });

  it('skal vise overlay', () => {
    const startDate = moment('2017-08-31').toDate();
    const endDate = moment('2018-08-31').toDate();
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={startDate}
      endDate={endDate}
      disabledDays={{}}
    />);

    const daypicker = wrapper.find(DayPicker);
    expect(daypicker).to.have.length(1);
    expect(daypicker.prop('months')).is.eql(['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli',
      'August', 'September', 'Oktober', 'November', 'Desember']);
    expect(daypicker.prop('weekdaysLong')).is.eql(['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']);
    expect(daypicker.prop('weekdaysShort')).is.eql(['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']);
    expect(daypicker.prop('firstDayOfWeek')).is.eql(1);
    expect(daypicker.prop('selectedDays')).is.eql([{
      from: startDate,
      to: endDate,
    }]);
    expect(daypicker.prop('initialMonth')).is.eql(endDate);
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', (done) => {
    const onCloseCallback = () => {
      expect(true).is.true;
      done();
    };
    const elementIsCalendarButton = () => false;
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={elementIsCalendarButton}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={{}}
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onBlur')('test');
  });

  it('skal kjøre callback når en trykker escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={{}}
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onKeyDown')({ keyCode: 27 });

    expect(onCloseCallback.called).is.true;
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={sinon.spy()}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={{}}
      onClose={onCloseCallback}
    />);

    wrapper.find('div').prop('onKeyDown')({ keyCode: 20 });

    expect(onCloseCallback.called).is.false;
  });

  it('skal sette input-dato når ingen dager er disabled', () => {
    const onDayChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={onDayChangeCallback}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={{}}
      onClose={sinon.spy()}
    />);

    const date = '2018-01-10';
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).is.true;
    expect(onDayChangeCallback.getCalls()).has.length(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).has.length(1);
    expect(args1[0]).is.eql(date);
  });

  it('skal sette input-dato når denne er innenfor det gyldige intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: '2018-01-05',
      after: '2018-01-10',
    };
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={onDayChangeCallback}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={disabledDays}
      onClose={sinon.spy()}
    />);

    const date = '2018-01-10';
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).is.true;
    expect(onDayChangeCallback.getCalls()).has.length(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).has.length(1);
    expect(args1[0]).is.eql(date);
  });

  it('skal ikke sette input-dato når denne er utenfor startdato i intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: '2018-01-05',
      after: '2018-01-10',
    };
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={onDayChangeCallback}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={disabledDays}
      onClose={sinon.spy()}
    />);

    const date = '2018-01-01';
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).is.false;
  });

  it('skal ikke sette input-dato når denne er utenfor sluttdato i intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: '2018-01-05',
      after: '2018-01-10',
    };
    const wrapper = shallowWithIntl(<PeriodCalendarOverlay.WrappedComponent
      intl={intlMock}
      onDayChange={onDayChangeCallback}
      className="test"
      dayPickerClassName="test"
      elementIsCalendarButton={sinon.spy()}
      startDate={moment('2017-08-31').toDate()}
      endDate={moment('2018-08-31').toDate()}
      disabledDays={disabledDays}
      onClose={sinon.spy()}
    />);

    const date = '2018-01-11';
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).is.false;
  });
});

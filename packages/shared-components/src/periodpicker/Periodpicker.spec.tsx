import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { Input } from 'nav-frontend-skjema';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import CalendarToggleButton from '../datepicker/CalendarToggleButton';
import PeriodCalendarOverlay from './PeriodCalendarOverlay';
import Periodpicker from './Periodpicker';

describe('<Periodpicker>', () => {
  it('skal vise periodefelt med angitt periode', () => {
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '30.08.2017' } }}
      toDate={{ input: { value: '31.10.2017' } }}
    />);

    const inputField = wrapper.find(Input);
    expect(inputField).to.have.length(1);
    expect(inputField.prop('value')).to.eql('30.08.2017 - 31.10.2017');
    expect(wrapper.find(CalendarToggleButton)).to.have.length(1);
  });

  it('skal vise dato-velger ved trykk på knapp', () => {
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '30.08.2017' } }}
      toDate={{ input: { value: '31.10.2017' } }}
    />);

    const button = wrapper.find(CalendarToggleButton);
    button.prop('toggleShowCalendar')();
    wrapper.update();

    const overlay = wrapper.find(PeriodCalendarOverlay);
    expect(overlay).to.have.length(1);
    expect(overlay.prop('startDate')).to.eql(moment('30.08.2017', DDMMYYYY_DATE_FORMAT).toDate());
    expect(overlay.prop('endDate')).to.eql(moment('31.10.2017', DDMMYYYY_DATE_FORMAT).toDate());
  });

  it('skal lage periode med lik start- og sluttdato når en velger dato og det ikke finnes noe fra før', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '', onChange: onChangeCallback } }}
      toDate={{ input: { value: '', onChange: onChangeCallback } }}
    />);

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.08.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const inputField = wrapper.find(Input);
    expect(inputField.prop('value')).to.eql('30.08.2017 - 30.08.2017');
  });

  it('skal lage periode med lik start- og sluttdato når en velger dato og det ikke finnes noe fra før', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '', onChange: onChangeCallback } }}
      toDate={{ input: { value: '', onChange: onChangeCallback } }}
    />);

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.08.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const inputField = wrapper.find(Input);
    expect(inputField.prop('value')).to.eql('30.08.2017 - 30.08.2017');
  });

  it('skal lage periode med ny startdato når en velger dato etter nåværende periode', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
      toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
    />);

    const inputField = wrapper.find(Input);
    const ref = inputField.prop('inputRef') as (params: any) => void;
    ref({ focus: sinon.spy() });
    wrapper.update();

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.07.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const updatedInputField = wrapper.find(Input);
    expect(updatedInputField.prop('value')).to.eql('30.07.2017 - 30.10.2017');
  });

  it('skal lage periode med ny sluttdato når en velger dato etter nåværende periode', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(<Periodpicker
      names={['fromDate', 'toDate']}
      // @ts-ignore
      fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
      toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
    />);

    const inputField = wrapper.find(Input);
    const ref = inputField.prop('inputRef') as (params: any) => void;
    ref({ focus: sinon.spy() });
    wrapper.update();

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.11.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const updatedInputField = wrapper.find(Input);
    expect(updatedInputField.prop('value')).to.eql('30.08.2017 - 30.11.2017');
  });
});
